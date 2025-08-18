"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Sample data for different metrics
const generateSampleData = (metric: string, timeFrame: string) => {
  const dataPoints = timeFrame === "hour" ? 60 : timeFrame === "day" ? 24 : timeFrame === "month" ? 30 : 12
  const baseValue = metric === "temperature" ? 25 : metric === "humidity" ? 45 : 75

  return Array.from({ length: dataPoints }, (_, i) => {
    const time =
      timeFrame === "hour"
        ? `${String(i).padStart(2, "0")}:00`
        : timeFrame === "day"
          ? `${String(i).padStart(2, "0")}:00`
          : timeFrame === "month"
            ? `Day ${i + 1}`
            : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]

    return {
      time,
      asset1: baseValue + Math.random() * 10 - 5,
      asset2: baseValue + Math.random() * 8 - 4,
      asset3: baseValue + Math.random() * 12 - 6,
      asset4: baseValue + Math.random() * 6 - 3,
    }
  })
}

const metricConfig = {
  temperature: {
    label: "Temperature",
    unit: "°C",
    color1: "#3b82f6", // blue
    color2: "#ef4444", // red
    color3: "#eab308", // yellow
    color4: "#06b6d4", // cyan
  },
  humidity: {
    label: "Humidity",
    unit: "%",
    color1: "#3b82f6",
    color2: "#ef4444",
    color3: "#eab308",
    color4: "#06b6d4",
  },
  power: {
    label: "Power Usage",
    unit: "kW",
    color1: "#3b82f6",
    color2: "#ef4444",
    color3: "#eab308",
    color4: "#06b6d4",
  },
}

export function Monitoring() {
  const [selectedMetric, setSelectedMetric] = useState<keyof typeof metricConfig>("temperature")
  const [selectedAsset, setSelectedAsset] = useState("all")
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("day")

  const data = generateSampleData(selectedMetric, selectedTimeFrame)
  const config = metricConfig[selectedMetric]

  const timeFrameOptions = [
    { value: "hour", label: "Hour" },
    { value: "day", label: "Day" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monitoring</h1>
        </div>

        {/* Metric Tabs */}
        <Tabs value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as keyof typeof metricConfig)}>
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="humidity">Humidity</TabsTrigger>
            <TabsTrigger value="power">Power Usage</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedMetric} className="space-y-6">
            {/* Graph Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Asset Selection</label>
                  <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select asset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Assets</SelectItem>
                      <SelectItem value="asset1">Asset 1</SelectItem>
                      <SelectItem value="asset2">Asset 2</SelectItem>
                      <SelectItem value="asset3">Asset 3</SelectItem>
                      <SelectItem value="asset4">Asset 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                {timeFrameOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={selectedTimeFrame === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTimeFrame(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Full Screen Graph */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{config.label} Monitoring</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 80,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value.toFixed(1)}${config.unit}`}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-md">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">Time</span>
                                    <span className="font-bold text-muted-foreground">{label}</span>
                                  </div>
                                </div>
                                <div className="mt-2 space-y-1">
                                  {payload.map((entry, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                      <span className="text-sm">
                                        {entry.name}: {entry.value?.toFixed(2)}
                                        {config.unit}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      {(selectedAsset === "all" || selectedAsset === "asset1") && (
                        <Line
                          type="monotone"
                          dataKey="asset1"
                          stroke={config.color1}
                          strokeWidth={2}
                          dot={false}
                          name="Asset 1"
                        />
                      )}
                      {(selectedAsset === "all" || selectedAsset === "asset2") && (
                        <Line
                          type="monotone"
                          dataKey="asset2"
                          stroke={config.color2}
                          strokeWidth={2}
                          dot={false}
                          name="Asset 2"
                        />
                      )}
                      {(selectedAsset === "all" || selectedAsset === "asset3") && (
                        <Line
                          type="monotone"
                          dataKey="asset3"
                          stroke={config.color3}
                          strokeWidth={2}
                          dot={false}
                          name="Asset 3"
                        />
                      )}
                      {(selectedAsset === "all" || selectedAsset === "asset4") && (
                        <Line
                          type="monotone"
                          dataKey="asset4"
                          stroke={config.color4}
                          strokeWidth={2}
                          dot={false}
                          name="Asset 4"
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend placed below the chart */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex flex-wrap gap-6 justify-center">
                    {(selectedAsset === "all" || selectedAsset === "asset1") && (
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-8 rounded" style={{ backgroundColor: config.color1 }} />
                        <span className="text-sm text-muted-foreground">Asset 1</span>
                      </div>
                    )}
                    {(selectedAsset === "all" || selectedAsset === "asset2") && (
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-8 rounded" style={{ backgroundColor: config.color2 }} />
                        <span className="text-sm text-muted-foreground">Asset 2</span>
                      </div>
                    )}
                    {(selectedAsset === "all" || selectedAsset === "asset3") && (
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-8 rounded" style={{ backgroundColor: config.color3 }} />
                        <span className="text-sm text-muted-foreground">Asset 3</span>
                      </div>
                    )}
                    {(selectedAsset === "all" || selectedAsset === "asset4") && (
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-8 rounded" style={{ backgroundColor: config.color4 }} />
                        <span className="text-sm text-muted-foreground">Asset 4</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export const monitoring = Monitoring
