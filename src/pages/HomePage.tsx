"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

type TemperatureData = {
  address: string
  timestamp: string
  temperature: number
  timeLabel?: string
}

export default function HomePage() {
  const [data, setData] = useState<TemperatureData[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      console.log("📡 Fetching temperature data...")
      try {
        const res = await fetch("http://192.168.50.157/api/temperatures")
        console.log("HTTP status:", res.status)
        console.log("Content-Type:", res.headers.get("content-type"))
    
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
    
        // Try parsing text first to see what’s really coming back
        const text = await res.text()
        console.log("📝 Raw text response:", text)
    
        // Then safely try to parse JSON
        let json: any
        try {
          json = JSON.parse(text)
        } catch (err) {
          console.error("❌ JSON.parse failed:", err)
          throw new Error("Invalid JSON response from API")
        }
    
        console.log("✅ Parsed JSON:", json)
    
        const processed = json.map((d: any) => ({
          ...d,
          timeLabel: new Date(d.timestamp).toISOString().substring(14, 19),
        }))
    
        console.log("🧩 Processed data:", processed)
        setData(processed)
      } catch (e: any) {
        console.error("❌ Failed to fetch temperature data:", e)
        setError(e.message)
      }
    }
    

    fetchData()
  }, [])

  useEffect(() => {
    if (data.length > 0) {
      console.log(`📈 Rendering chart with ${data.length} points`)
    }
  }, [data])

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>
  }

  if (data.length === 0) {
    return <div className="p-4 text-muted-foreground">Loading...</div>
  }

  return (
    <div className="flex flex-col h-full overflow-hidden p-4">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Temperature Graph</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="timeLabel"
                label={{ value: "Time (s)", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                label={{ value: "Temperature (°C)", angle: -90, position: "insideLeft" }}
              />
              <Tooltip formatter={(v) => `${v} °C`} />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#2563eb"
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
