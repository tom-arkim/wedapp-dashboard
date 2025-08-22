"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Key, Plus, Copy, Eye, EyeOff, Edit, Trash2, Calendar, Shield, AlertTriangle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ApiKey {
  id: string
  name: string
  description: string
  key: string
  status: "active" | "inactive" | "expired"
  permissions: string[]
  createdAt: string
  expiresAt: string
  lastUsed: string
  usageCount: number
}

const mockApiKeys: ApiKey[] = [
  {
    id: "1",
    name: "Production Dashboard API",
    description: "Main API key for production dashboard access",
    key: "sk_prod_1234567890abcdef1234567890abcdef",
    status: "active",
    permissions: ["read:equipment", "read:maintenance", "read:reports"],
    createdAt: "2024-01-01",
    expiresAt: "2024-12-31",
    lastUsed: "2024-01-15 14:30",
    usageCount: 1247,
  },
  {
    id: "2",
    name: "Mobile App Integration",
    description: "API key for mobile application integration",
    key: "sk_mobile_abcdef1234567890abcdef1234567890",
    status: "active",
    permissions: ["read:equipment", "write:maintenance"],
    createdAt: "2023-11-15",
    expiresAt: "2024-11-15",
    lastUsed: "2024-01-14 09:15",
    usageCount: 892,
  },
  {
    id: "3",
    name: "Legacy System Bridge",
    description: "Deprecated API key for legacy system integration",
    key: "sk_legacy_fedcba0987654321fedcba0987654321",
    status: "inactive",
    permissions: ["read:equipment"],
    createdAt: "2023-06-01",
    expiresAt: "2024-06-01",
    lastUsed: "2023-12-20 16:45",
    usageCount: 156,
  },
]

const availablePermissions = [
  { id: "read:equipment", label: "Read Equipment Data", description: "View equipment information and status" },
  { id: "write:equipment", label: "Write Equipment Data", description: "Create and update equipment records" },
  { id: "read:maintenance", label: "Read Maintenance Data", description: "View maintenance schedules and history" },
  { id: "write:maintenance", label: "Write Maintenance Data", description: "Create and update maintenance records" },
  { id: "read:reports", label: "Read Reports", description: "Access generated reports and analytics" },
  { id: "write:reports", label: "Generate Reports", description: "Create and export custom reports" },
  { id: "read:users", label: "Read User Data", description: "View user information and permissions" },
  { id: "write:users", label: "Manage Users", description: "Create and manage user accounts" },
  { id: "admin", label: "Admin Access", description: "Full administrative access to all resources" },
]

export function ApiKeysSettings() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const [newApiKey, setNewApiKey] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
    expiresAt: "",
  })

  const getStatusBadge = (status: ApiKey["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "expired":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Expired</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys)
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId)
    } else {
      newVisibleKeys.add(keyId)
    }
    setVisibleKeys(newVisibleKeys)
  }

  const copyToClipboard = async (text: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(keyId)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const maskApiKey = (key: string) => {
    return key.substring(0, 12) + "..." + key.substring(key.length - 4)
  }

  const handleCreateApiKey = () => {
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newApiKey.name,
      description: newApiKey.description,
      key: `sk_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      status: "active",
      permissions: newApiKey.permissions,
      createdAt: new Date().toISOString().split("T")[0],
      expiresAt: newApiKey.expiresAt,
      lastUsed: "Never",
      usageCount: 0,
    }
    setApiKeys([...apiKeys, newKey])
    setNewApiKey({ name: "", description: "", permissions: [], expiresAt: "" })
    setIsCreateDialogOpen(false)
  }

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setNewApiKey((prev) => ({ ...prev, permissions: [...prev.permissions, permissionId] }))
    } else {
      setNewApiKey((prev) => ({ ...prev, permissions: prev.permissions.filter((p) => p !== permissionId) }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground mt-1">Manage API keys for external integrations and applications.</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key with specific permissions for external integrations.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="key-name">API Key Name *</Label>
                  <Input
                    id="key-name"
                    value={newApiKey.name}
                    onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
                    placeholder="e.g., Mobile App Integration"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expires-at">Expiration Date</Label>
                  <Input
                    id="expires-at"
                    type="date"
                    value={newApiKey.expiresAt}
                    onChange={(e) => setNewApiKey({ ...newApiKey, expiresAt: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="key-description">Description</Label>
                <Textarea
                  id="key-description"
                  value={newApiKey.description}
                  onChange={(e) => setNewApiKey({ ...newApiKey, description: e.target.value })}
                  placeholder="Brief description of what this API key will be used for..."
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <Label>Permissions *</Label>
                <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                  {availablePermissions.map((permission) => (
                    <div key={permission.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={permission.id}
                        checked={newApiKey.permissions.includes(permission.id)}
                        onCheckedChange={(checked) => handlePermissionChange(permission.id, !!checked)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor={permission.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permission.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">{permission.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  API keys provide access to your data. Only grant the minimum permissions necessary and store keys
                  securely.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateApiKey} disabled={!newApiKey.name || newApiKey.permissions.length === 0}>
                  Create API Key
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total API Keys</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiKeys.length}</div>
            <p className="text-xs text-muted-foreground">
              {apiKeys.filter((key) => key.status === "active").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total API Calls</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apiKeys.reduce((sum, key) => sum + key.usageCount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys
          </CardTitle>
          <CardDescription>Manage your API keys and their permissions.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{apiKey.name}</div>
                      <div className="text-sm text-muted-foreground">{apiKey.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="h-6 w-6 p-0"
                      >
                        {visibleKeys.has(apiKey.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      {copiedKey === apiKey.id && <span className="text-xs text-green-600">Copied!</span>}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(apiKey.status)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {apiKey.permissions.slice(0, 2).map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission.split(":")[1]}
                        </Badge>
                      ))}
                      {apiKey.permissions.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{apiKey.permissions.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{apiKey.usageCount.toLocaleString()} calls</div>
                      <div className="text-muted-foreground">Last: {apiKey.lastUsed}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{apiKey.expiresAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          •••
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Key className="h-4 w-4 mr-2" />
                          Regenerate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>Quick links to API documentation and integration guides.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
              <div className="text-left">
                <div className="font-medium">API Reference</div>
                <div className="text-sm text-muted-foreground">Complete API documentation and endpoints</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
              <div className="text-left">
                <div className="font-medium">Integration Guide</div>
                <div className="text-sm text-muted-foreground">Step-by-step integration tutorials</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
