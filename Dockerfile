FROM node:20-alpine

WORKDIR /app

# Dependencias primero (cache)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Código
COPY . .

# Nest corre en 3000
EXPOSE 3000

# Dev (watch)
CMD ["yarn", "start:dev"]
