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
import { Clock } from "lucide-react";
import type { TemperatureData } from "@/components/api/temperatureApi";
import { api } from "@/components/api";

export function TemperatureCard() {
  const [data, setData] = useState<TemperatureData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [updateInterval, setUpdateInterval] = useState(30); // seconds
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let progressId: NodeJS.Timeout;
    let startTime = Date.now();

    async function fetchData() {
      try {
        const result = await api.temperatureApi.getAll();
        setData(result);
        setError(null);
        startTime = Date.now();
        setProgress(0);
      } catch (e: any) {
        console.error("❌ Failed to fetch temperature data:", e);
        setError(e.message);
      }
    }

    fetchData();

    // Update radial progress
    progressId = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setProgress(Math.min((elapsed / updateInterval) * 100, 100));
    }, 100);

    // Auto refresh
    intervalId = setInterval(fetchData, updateInterval * 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(progressId);
    };
  }, [updateInterval]);

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

  // Radial progress config
  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <Card className="w-full h-[420px]">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Temperature</CardTitle>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock size={18} className="text-muted-foreground" />
          <select
            value={updateInterval}
            onChange={(e) => setUpdateInterval(Number(e.target.value))}
            className="border rounded p-1 text-sm bg-background"
          >
            <option value={10}>10s</option>
            <option value={30}>30s</option>
            <option value={60}>1m</option>
            <option value={300}>5m</option>
          </select>

          {/* Small radial progress indicator */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className="text-muted-foreground"
          >
            <circle
              cx="12"
              cy="12"
              r={radius}
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.15"
            />
            <circle
              cx="12"
              cy="12"
              r={radius}
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.1s linear" }}
            />
          </svg>
        </div>
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
