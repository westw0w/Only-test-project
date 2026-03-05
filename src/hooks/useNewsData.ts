// Хук для загрузки новостей
// Возвращает состояние загрузки, ошибки и данные

import { useState, useEffect } from "react";
import { fetchNewsData, type ApiResponse } from "@/services/api";

export const useNewsData = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNewsData()
      .then((fetchedData: ApiResponse) => {
        setData(fetchedData);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message || "Не удалось загрузить данные");
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
};