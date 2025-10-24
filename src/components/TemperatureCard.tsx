"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";
import type { TemperatureData } from "@/components/api/temperatureApi";
import { api } from "@/components/api";

export function TemperatureCard() {
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

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (data.length === 0)
    return <div className="p-4 text-muted-foreground">Loading...</div>;

  // Group by address
  const grouped = data.reduce<Record<string, TemperatureData[]>>((acc, item) => {
    if (!acc[item.address]) acc[item.address] = [];
    acc[item.address].push(item);
    return acc;
  }, {});

  const timestamps = Array.from(new Set(data.map((d) => d.timeLabel!))).sort();

  const mergedData = timestamps.map((timeLabel) => {
    const entry: Record<string, any> = { timeLabel };
    for (const [address, items] of Object.entries(grouped)) {
      const found = items.find((i) => i.timeLabel === timeLabel);
      entry[address] = found ? found.temperature : null;
    }
    return entry;
  });

  const tickCount = 10;
  const tickStep = Math.max(1, Math.floor(timestamps.length / tickCount));
  const tickValues = timestamps.filter((_, i) => i % tickStep === 0);
  const colors = ["#2563eb", "#dc2626", "#16a34a", "#9333ea", "#f59e0b", "#06b6d4"];

  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle>Temperature Graph</CardTitle>
      </CardHeader>
      <CardContent className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mergedData}>
            <XAxis dataKey="timeLabel" tickFormatter={(v) => v} ticks={tickValues}>
              <Label value="Time" position="insideBottom" offset={-5} />
            </XAxis>
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
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
