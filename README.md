# Simple Task Manager
### Рабочий fullstack проект с REST API

## Требования
- JWT Аутентификация (регистрация/логин)
- CRUD задач с фильтрами по статусу
- Безопасность (Helmet, Rate Limit, JWT)
- Документация API (Swagger)
- Тесты (Jest + Supertest)
- Валидация входных данных (Yup) (опционально)
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

### Задачи и промежуточные этапы
- [x] Инициализация проекта
- [x] Структура файлов
- L--> [x] Разделение на back и front
- [x] Сформированные сущности в БД
- L--> [x] Task
- L--> [x] User
- L--> [ ] Tag
- [x] Основные ручки
- L--> [x] Временные заглушки на endpoints
- [x] Аутентификация и регистрация
- [x] Авторизация пользователя
- [x] Общие меры безопасности
- [x] Валидация данных
- [x] Подключение JWT
- [x] SwaggerAPI документация
- [x] Тестирование API
- L--> [ ] Исправление неработающих проверок
- [ ] Фикс frontend-части проекта
- [ ] github workflows
- [ ] Документация проекта