"use client";

import { TemperatureCard } from "@/components/TemperatureCard";
import { TemperatureHistoryCard } from "@/components/TemperatureHistoryCard";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <TemperatureCard />
      <TemperatureHistoryCard />
    </div>
  );
}
