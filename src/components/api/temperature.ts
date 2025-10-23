import { baseApi } from "./base";

export interface TemperatureData {
  address: string;
  timestamp: string;
  temperature: number;
  timeLabel?: string;
}

export const temperatureApi = {
  async getAll(): Promise<TemperatureData[]> {
    const json = await baseApi.get<TemperatureData[]>("/api/temperatures");

    return json.map(d => ({
      ...d,
      timeLabel: new Date(d.timestamp).toISOString().substring(14, 19),
    }));
  },

  subscribe(onUpdate: (data: TemperatureData[]) => void): EventSource {
    return baseApi.sse<TemperatureData[]>("/api/temperatures/events", raw => {
      const processed = raw.map(d => ({
        ...d,
        timeLabel: new Date(d.timestamp).toISOString().substring(14, 19),
      }));
      onUpdate(processed);
    });
  },
};
