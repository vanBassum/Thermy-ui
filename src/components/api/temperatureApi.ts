import { baseApi } from "./base";

export interface TemperatureData {
  address: string;
  temperature: number;
  timeLabel?: string;
}

export const temperatureApi = {
  async getAll(): Promise<TemperatureData[]> {
    const json = await baseApi.get<
      { address: string; temperature: number }[]
    >("/api/temperatures");

    return json.map(d => ({
      ...d,
      // optional local HH:MM:SS label
      timeLabel: new Date().toISOString().substring(11, 19),
    }));
  },

  subscribe(onUpdate: (data: TemperatureData[]) => void): EventSource {
    return baseApi.sse<
      { address: string; temperature: number }[]
    >("/api/temperatures/events", raw => {
      const processed = raw.map(d => ({
        ...d,
        timeLabel: new Date().toISOString().substring(11, 19),
      }));
      onUpdate(processed);
    });
  },
};
