"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { TemperatureData } from "@/components/api/temperature";
import { api } from "@/components/api";

export default function HomePage() {
  const [data, setData] = useState<TemperatureData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await api.temperatureApi.getAll();
        setData(result);
      } catch (e: any) {
        console.error("❌ Failed to fetch temperature data:", e);
        setError(e.message);
      }
    }

    fetchData();
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (data.length === 0) {
    return <div className="p-4 text-muted-foreground">Loading...</div>;
  }

  // 🔹 Group data by address
  const grouped = data.reduce<Record<string, TemperatureData[]>>((acc, item) => {
    if (!acc[item.address]) acc[item.address] = [];
    acc[item.address].push(item);
    return acc;
  }, {});

  // 🔹 Get unique timestamps to use as x-axis keys
  const timestamps = Array.from(new Set(data.map(d => d.timeLabel))).sort();

  // 🔹 Merge grouped data into a single dataset for the chart
  const mergedData = timestamps.map(timeLabel => {
    const entry: Record<string, any> = { timeLabel };
    for (const [address, items] of Object.entries(grouped)) {
      const found = items.find(i => i.timeLabel === timeLabel);
      entry[address] = found ? found.temperature : null;
    }
    return entry;
  });

  // 🔹 Color palette for each address
  const colors = ["#2563eb", "#dc2626", "#16a34a", "#9333ea", "#f59e0b", "#06b6d4"];

  return (
    <div className="flex flex-col h-full overflow-hidden p-4">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Temperature Graph</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mergedData}>
              <XAxis
                dataKey="timeLabel"
                label={{ value: "Time (s)", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                label={{
                  value: "Temperature (°C)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip formatter={(v) => (v != null ? `${v} °C` : "-")} />
              <Legend />
              {Object.keys(grouped).map((address, idx) => (
                <Line
                  key={address}
                  type="monotone"
                  dataKey={address}
                  stroke={colors[idx % colors.length]}
                  strokeWidth={2}
                  dot={false} // 🔸 No dots, only line
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
