"use client";

import { TemperatureCard } from "@/components/TemperatureCard";
import { StatsCard } from "@/components/StatsCard";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <TemperatureCard />
      <StatsCard />
    </div>
  );
}
