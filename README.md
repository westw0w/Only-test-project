# Тестовое задание 

Проект представляет собой интерактивное веб-приложение для отображения исторических событий по категориям с анимациями и каруселью.

## 🚀 Технологии

- **React 19** с TypeScript
- **Webpack 5** – сборка
- **SCSS** – стили с модульной архитектурой
- **GSAP** – анимации
- **Swiper** – карусель/слайдер
- **Babel** – транспиляция

## 📁 Структура проекта

```
test-project---only/
├── public/              # Статические файлы
├── src/
│   ├── app/            # Главный компонент App
│   ├── components/     # React-компоненты (History, Loader)
│   ├── hooks/          # Кастомные хуки (useNewsData, useCarouselAnimation, useYearAnimation)
│   ├── services/       # API-сервисы
│   ├── styles/scss/    # SCSS-стили (блоки, глобальные переменные, миксины)
│   ├── types/          # TypeScript-типы
│   ├── assets/         # Шрифты и изображения
│   ├── database/       # JSON-данные
│   ├── index.tsx       # Точка входа
│   └── style.scss      # Главный SCSS-файл
├── package.json
├── webpack.config.js
├── tsconfig.json
├── postcss.config.js
└── (остальные конфиги)
```

## ⚙️ Установка и запуск

1. Клонируйте репозиторий (если есть) или скопируйте файлы проекта.
2. Установите зависимости:

```bash
npm install
```

3. Запустите dev-сервер:

```bash
npm start
```

Приложение откроется в браузере по адресу `http://localhost:3000` (порт настраивается в `webpack.config.js`).

## 📜 Доступные скрипты

- `npm start` – запуск development-сервера с hot reload
- `npm run build` – production-сборка
- `npm run build:dev` – development-сборка
- `npm run watch` – сборка в watch-режиме
- `npm run type-check` – проверка типов TypeScript
- `npm run lint` – запуск ESLint
- `npm run clean` – удаление папки `dist`
- `npm run serve` – запуск статического сервера для собранного приложения

## 🧩 Компоненты

### `History`
Главный компонент, который:
- Загружает данные через `useNewsData`
- Управляет категориями с каруселью кнопок (анимация через `useCarouselAnimation`)
- Анимирует годы через `useYearAnimation`
- Рендерит Swiper-слайдер с событиями
- Обрабатывает навигацию (предыдущая/следующая категория, слайды)

### `Loader`
Компонент-индикатор загрузки с анимацией.

### Кастомные хуки
- `useNewsData` – загрузка и кэширование данных из `data.json`
- `useCarouselAnimation` – логика анимации вращения карусели категорий
- `useYearAnimation` – интерполяция чисел для плавного изменения годов

## 🎨 Стили

Стили написаны на SCSS с использованием методологии БЭМ-подобной структуры:
- `src/styles/scss/global/` – глобальные переменные, сбросы, миксины
- `src/styles/scss/blocks/` – стили компонентов (history, swiper, loader)

## 📊 Данные

Данные хранятся в `src/database/data.json` в формате:

```json
{
  "news": {
    "Категория 1": {
      "1990": "Описание события 1990 года",
      "2000": "Описание события 2000 года"
    },
    "Категория 2": { ... }
  }
}
```

## 📦 Зависимости

Основные зависимости см. в `package.json`. Ключевые:

- `react`, `react-dom`
- `gsap`
- `swiper`
- `react-loader-spinner`

## 🛠️ Конфигурация

- **Webpack** – настроен для TypeScript, SCSS, шрифтов, изображений.
- **TypeScript** – строгая типизация с путями (`@/*`).