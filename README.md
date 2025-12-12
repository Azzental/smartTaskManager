# Simple Task Manager
### Рабочий мини-проект с REST API

## Требования
- JWT Аутентификация (регистрация/логин)
- CRUD задач с фильтрами по статусу
- Валидация входных данных (Yup)
- Безопасность (Helmet, Rate Limit, JWT)
- Документация API (Swagger)
- Тесты (Jest + Supertest)
- Контейнеризация Docker (опционально)

## Структура БД
См. prisma/schema.prisma

## Запуск
### Локально
- Backend: `cd backend && npm run dev`
- Frontend: `cd frontend && npm run dev`

### С контейнерами Docker
`docker-compose up --build`

## API Docs / Swagger
http://localhost:5000/api-docs

## Тесты
`cd backend && npm test`

