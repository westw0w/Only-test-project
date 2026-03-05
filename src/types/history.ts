import { ApiResponse, NewsData } from "@/services/api";

export type { ApiResponse, NewsData };

export interface NewsItem {
  year: number;
  description: string;
}
