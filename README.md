# Simple Task Manager
### REST API fullstack (пока что backend) проект

## Требования
- JWT аутентификация с защитой от брутфорс атак
- CRUD задач с фильтрами по статусу
- Безопасность (Helmet, Rate Limit, JWT)
- Документация API (Swagger)
- Тесты (Jest + Supertest)
- Валидация входных данных (Yup) (опционально)
- Контейнеризация Docker (опционально)

## Запуск
### Локально
- Backend: `cd backend && npm run dev`
- Frontend: `cd frontend && npm run dev`

### С контейнерами Docker
`docker-compose up --build`

## Тесты
`cd backend && npm test`

## API Docs / Swagger
http://localhost:5000/api-docs

## Проверка на работоспособность
http://localhost:5000/health

### Авторизация вручную
```
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "yourmail@example.com",
    "password": "yourpasswordhere",
    "name": "Your Name"
  }'
```
```
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "yourmail@example.com",
    "password": "yourpasswordhere"
  }'
```
### Все взаимодействия с сервисом происходят с использованием JWT токена в заголовке
```
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Структура БД
См. prisma/schema.prisma

## Задачи и промежуточные этапы
- [x] Инициализация проекта
- [x] Структура файлов
- [x] └──> Разделение на back и front
- [x] Сформированные сущности в БД
- [x] ├──> Task
- [x] ├──> User
- [ ] └──> Tag
- [x] Основные ручки
- [x] └──> Временные заглушки на endpoints
- [x] Аутентификация и регистрация
- [x] Авторизация пользователя
- [x] Общие меры безопасности
- [x] Валидация данных
- [x] Подключение JWT
- [x] SwaggerAPI документация
- [x] Тестирование API
- [x] L--> Исправление неработающих проверок
- [ ] Документация проекта
- [ ] Фикс frontend-части проекта
- [ ] github workflows

