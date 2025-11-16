"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TemperatureData } from "@/components/api/temperatureApi";
import { api } from "@/components/api";

const sensorColors = ["red", "blue", "green", "yellow"];
const MAX_HISTORY = 2880; // 8 hours @ 10 sec interval

function formatMac(address: number | string): string {
  const hex = BigInt(address).toString(16).padStart(16, "0").toUpperCase();
  return hex.match(/.{2}/g)!.join(":");
}

export function TemperatureHistoryCard() {
  const [latest, setLatest] = useState<TemperatureData[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    async function fetchData() {
      const result = await api.temperatureApi.getAll();
      setLatest(result);

      const row: any = {
        time: new Date().toLocaleTimeString(),
      };

      result.forEach((t) => {
        row[t.address] = t.temperature;
      });

      // ♻️ Keep last 8 hours (2880 points)
      setHistory((prev) => [...prev.slice(-MAX_HISTORY), row]);
    }

    fetchData();
    intervalId = setInterval(fetchData, 10_000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card className="w-full h-[350px]">
      <CardHeader>
        <CardTitle>Temperature History (Last 8 Hours)</CardTitle>
      </CardHeader>

      <CardContent className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <XAxis dataKey="time" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <Legend />

            {latest.map((sensor, idx) => (
              <Line
                key={sensor.address}
                type="monotone"
                dataKey={sensor.address}
                name={formatMac(sensor.address)}
                stroke={sensorColors[idx]}
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
