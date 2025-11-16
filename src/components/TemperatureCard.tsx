"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TemperatureData } from "@/components/api/temperatureApi";
import { api } from "@/components/api";
import { RefreshCcw } from "lucide-react";

const sensorColors = ["red", "blue", "green", "yellow"];

function formatMac(address: number | string): string {
  const hex = BigInt(address).toString(16).padStart(16, "0").toUpperCase();
  return hex.match(/.{2}/g)!.join(":");
}

export function TemperatureCard() {
  const [data, setData] = useState<TemperatureData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    async function fetchData() {
      try {
        setLoading(true);
        const result = await api.temperatureApi.getAll();
        setData(result);
        setError(null);
      } catch (e: any) {
        console.error("Failed to fetch temperatures:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    intervalId = setInterval(fetchData, 10_000);

    return () => clearInterval(intervalId);
  }, []);

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (data.length === 0)
    return <div className="p-4 text-muted-foreground">Loading...</div>;

  return (
    <Card className="w-full max-w-[250px]">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Temperatures</CardTitle>
        {loading && (
          <RefreshCcw size={18} className="animate-spin text-muted-foreground" />
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {data.map((t, idx) => (
            <div
              key={t.address}
              className="flex flex-col items-center p-2 border rounded"
            >
              {/* MAC address */}
              <span className="font-mono text-xs mb-1">
                {formatMac(t.address)}
              </span>

              {/* Colored temperature badge */}
              <span
                className="px-4 py-1 text-white font-semibold rounded-full text-lg"
                style={{
                  backgroundColor: sensorColors[idx],
                }}
              >
                {t.temperature.toFixed(1)}°C
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
