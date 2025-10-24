import { baseApi } from "./base";

export interface TemperatureData {
  address: string;
  timestamp: Date;
  temperature: number;
  timeLabel?: string;
}

export const temperatureApi = {
  async getAll(): Promise<TemperatureData[]> {
    // 👇 we tell TypeScript the incoming timestamp is a string
    const json = await baseApi.get<
      (Omit<TemperatureData, "timestamp"> & { timestamp: string })[]
    >("/api/temperatures");

    return json.map(d => {
      const date = new Date(d.timestamp);
      return {
        ...d, // ✅ includes address + temperature
        timestamp: date, // ✅ overwrite with real Date
        timeLabel: date.toISOString().substring(11, 19), // "HH:MM:SS"
      };
    });
  },

  subscribe(onUpdate: (data: TemperatureData[]) => void): EventSource {
    return baseApi.sse<
      (Omit<TemperatureData, "timestamp"> & { timestamp: string })[]
    >("/api/temperatures/events", raw => {
      const processed = raw.map(d => {
        const date = new Date(d.timestamp);
        return {
          ...d,
          timestamp: date,
          timeLabel: date.toISOString().substring(11, 19),
        };
      });
      onUpdate(processed);
    });
  },
};
