/**
 * Имитация API-запроса для получения данных новостей.
 * Возвращает Promise с данными из data.json после задержки.
 */
export interface NewsData {
  [category: string]: {
    [year: string]: string;
  };
}

export interface ApiResponse {
  news: NewsData;
}

const MOCK_DELAY_MS = 500;

export const fetchNewsData = (): Promise<ApiResponse> => {
  return new Promise((resolve) => {
    // Имитируем задержку сети
    setTimeout(() => {
      // В реальном приложении здесь был бы fetch('/database/data.json')
      // Для имитации импортируем данные из JSON-файла.
      // Поскольку мы не можем динамически импортировать JSON в рантайме без сборщика,
      // используем статический импорт.
      import('@/database/data.json')
        .then((module) => {
          resolve(module.default);
        })
        .catch((error) => {
          console.error('Failed to load news data:', error);
          // Возвращаем пустые данные в случае ошибки
          resolve({ news: {} });
        });
    }, MOCK_DELAY_MS);
  });
};

/**
 * Альтернативная реализация с использованием fetch (если JSON доступен как статический файл)
 */
export const fetchNewsDataViaFetch = (): Promise<ApiResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fetch('/database/data.json')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => resolve(data))
        .catch((error) => {
          console.error('Fetch failed, using fallback:', error);
          // Фолбэк на импорт
          import('@/database/data.json')
            .then((module) => resolve(module.default))
            .catch(() => resolve({ news: {} }));
        });
    }, MOCK_DELAY_MS);
  });
};