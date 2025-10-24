import { baseApi } from "./base";


export interface StatData {
  name: string;
  count: number;
  min: number;
  max: number;
  avg: number;
  last: number;
  stddev: number;
}

export const statsApi = {
  async getAll(): Promise<StatData[]> {
    const json = await baseApi.get<StatData[]>("/api/stats");
    return json;
  },

  subscribe(onUpdate: (data: StatData[]) => void): EventSource {
    return baseApi.sse<StatData[]>("/api/stats/events", raw => {
      onUpdate(raw);
    });
  },
};
