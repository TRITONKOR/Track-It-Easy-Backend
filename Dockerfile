# -------- Build Stage --------
FROM node:22 AS builder

WORKDIR /app

# Копіюємо package.json і package-lock.json для кешування залежностей
COPY package.json package-lock.json ./

# Встановлюємо всі залежності (включно з dev)
RUN npm install

# Копіюємо весь код
COPY . .

# Запускаємо збірку TypeScript (припускаємо, що в package.json є "build": "tsc")
RUN npm run build

# -------- Production Stage --------
FROM node:22-alpine

# Створюємо системного користувача
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Копіюємо тільки продакшн-залежності
COPY package.json package-lock.json ./
RUN npm install --production

# Копіюємо скомпільовані файли з білд-стадії
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist

# Якщо потрібні якісь статичні файли або конфіги, то їх також можна скопіювати
# COPY --from=builder --chown=appuser:appgroup /app/some_static_folder ./some_static_folder

USER appuser

ENV NODE_ENV=production
EXPOSE 3000

# Запускаємо скомпільований сервер
CMD ["node", "dist/server.js"]
