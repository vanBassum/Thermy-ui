"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/components/api";
import type { StatData } from "@/components/api/statsApi";

export function StatsCard() {
  const [stats, setStats] = useState<StatData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const result = await api.statsApi.getAll();
        setStats(result);
      } catch (e: any) {
        console.error("❌ Failed to fetch stats:", e);
        setError(e.message);
      }
    }

    fetchStats();
  }, []);

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (stats.length === 0)
    return <div className="p-4 text-muted-foreground">Loading...</div>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>System Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Count</th>
              <th className="p-2">Min</th>
              <th className="p-2">Max</th>
              <th className="p-2">Avg</th>
              <th className="p-2">Last</th>
              <th className="p-2">StdDev</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => (
              <tr key={s.name} className="border-b">
                <td className="p-2 font-medium">{s.name}</td>
                <td className="p-2">{s.count}</td>
                <td className="p-2">{s.min}</td>
                <td className="p-2">{s.max}</td>
                <td className="p-2">{s.avg.toFixed(3)}</td>
                <td className="p-2">{s.last}</td>
                <td className="p-2">{s.stddev.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
