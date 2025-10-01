# Система голосования за идеи LogicLike

Публичная страница для голосования за идеи развития продукта LogicLike с ограничением голосования по IP-адресу.

## Требования

- Docker и Docker Compose
- Node.js 18+ (для локальной разработки)
- PostgreSQL (для локальной разработки)

## Быстрый запуск через Docker-Compose

```bash
# Клонируйте репозиторий
git clone https://github.com/darterss/kids-apps.git
cd kids-apps

# Настройте переменные окружения
cp env.example .env

# Запустите весь стек одной командой
docker-compose up -d
```

#### Приложение будет доступно по адресу:
#### - Frontend: http://localhost:3000

### Остановка

```bash
docker-compose down
```

## Запуск в режиме локальной разработки

### Backend

```bash
cd backend

# Установка зависимостей
npm install

# Настройте переменные окружения
cp env.example .env

# Запуск PostgreSQL (через Docker)
docker run -d --name postgres \
  -e POSTGRES_DB=ideas_voting \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 postgres:15-alpine

# Генерация Prisma клиента
npx prisma generate

# Применение миграций
npx prisma db push

# Заполнение БД тестовыми данными
npx prisma db seed

# Запуск в режиме разработки
npm run dev
```

### Frontend

```bash
cd frontend

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm start
```

#### Приложение будет доступно по адресу:
#### - Frontend: http://localhost:3000