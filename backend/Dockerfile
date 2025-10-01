FROM node:20-alpine

# Устанавливаем OpenSSL и другие необходимые пакеты
RUN apk add --no-cache openssl libc6-compat

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./
COPY prisma ./prisma/

# Устанавливаем зависимости
RUN npm install

# Устанавливаем типы для request-ip
#RUN npm install --save-dev @types/request-ip

# Генерируем Prisma клиент
RUN npx prisma generate

# Копируем исходный код
COPY . .

# Собираем проект
RUN npm run build

# Открываем порт
EXPOSE 3001

# Команда запуска
CMD ["sh", "-c", "npx prisma db push && npx prisma db seed && npm start"]