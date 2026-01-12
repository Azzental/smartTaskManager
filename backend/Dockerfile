FROM node:18

WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm ci --only=production

# Копируем исходный код
COPY . .

# Генерируем Prisma клиент
RUN npx prisma generate

# Создаем пользователя Node.js для безопасности
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Меняем владельца файлов
RUN chown -R nodejs:nodejs /app
USER nodejs

# Открываем порт
EXPOSE 5000

# Команда запуска
CMD ["npm", "start"]