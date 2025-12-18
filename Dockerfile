# -------- Build Stage --------
FROM node:22 AS builder

WORKDIR /app

# Копіюємо package.json і package-lock.json для кешування залежностей
COPY package.json package-lock.json ./

# Встановлюємо всі залежності (dev + prod)
RUN npm install

# Копіюємо весь код
COPY . .

# Запускаємо збірку TypeScript
RUN npm run build

ENV DATABASE_URL=postgresql://postgres:kGuvkrQrPhUDXAVDcOqmxBnoZnpLkQAt@postgres.railway.internal:5432/railway
RUN npx drizzle-kit push --config ./drizzle.config.ts

# -------- Production Stage --------
FROM node:22-alpine

# Створюємо системного користувача
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Копіюємо тільки продакшн-залежності
COPY package.json package-lock.json ./
RUN npm install --production

# Копіюємо з build stage тільки dist
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist

USER appuser
ENV NODE_ENV=production
EXPOSE 3000

# Запускаємо сервер
CMD ["node", "dist/server.js"]
