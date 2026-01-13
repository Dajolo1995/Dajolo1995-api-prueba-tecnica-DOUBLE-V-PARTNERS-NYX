<p align="center">
  <a href="https://nestjs.com" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<h1 align="center">NestJS API – Debt Management</h1>

<p align="center">
  API desarrollada con <b>NestJS</b>, <b>Prisma</b> y <b>PostgreSQL</b>, orientada a la gestión de usuarios y deudas compartidas.
</p>

---

## 📌 Descripción

Este proyecto es una API backend construida con **NestJS** y **TypeScript**, utilizando **Prisma ORM** para la persistencia de datos y **PostgreSQL** como base de datos.

La arquitectura está pensada para ser **escalable**, **mantenible** y **fácil de desplegar** en entornos locales mediante **Docker**.

---

## 🧠 Decisiones técnicas

- **NestJS**: Framework progresivo que facilita la arquitectura modular, inyección de dependencias y buenas prácticas.
- **Prisma ORM**: Se eligió por su tipado fuerte, facilidad de migraciones y excelente integración con TypeScript.
- **PostgreSQL**: Base de datos relacional robusta, ideal para relaciones entre usuarios y deudas.
- **Docker & Docker Compose**: Permite levantar la API y la base de datos de forma consistente en cualquier entorno.
- **Jest**: Framework de testing para pruebas unitarias y de integración.

---

## ⚙️ Requisitos previos

Asegúrate de tener instalados:

- Node.js >= 22
- Yarn
- Docker
- Docker Compose

---

## 🚀 Despliegue local (Docker)

### 1.  Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```


### 2. en el docker-compose.yml debe incluir estas variables de entorno. (Ya esta incluida)
DATABASE_URL="postgresql://postgres:postgres@db:5432/app_db"
PORT=3000

### 3. Levantar los contenedores

```bash
yarn docker
```
### 4 Ejecutar migraciones y generar Prisma Client

```bash
yarn migrate
yarn generate
```


5. Acceso a la API Una vez levantado:
```bash
http://localhost:3000
```


Script disponibles 

# Generar Prisma Client
yarn prisma:generate

# Crear y ejecutar migraciones locales
yarn prisma:migrate

# Sincronizar esquema sin migraciones
yarn db:push

# Prisma Studio (UI de la BD)
yarn db:studio

# Migraciones dentro de Docker
yarn migrate

# Generar Prisma Client dentro de Docker
yarn generate

# Levantar entorno Docker
yarn docker

# Detener contenedores
yarn down

# Ejecutar tests
yarn test


### 🧠 Capa de Caché

Se implementó una capa de caché utilizando `cache-manager` de NestJS, simulando Redis en memoria para el entorno local.

El caché se utiliza para:
- Reducir consultas repetidas a la base de datos
- Mejorar tiempos de respuesta en validación de usuarios
- Demostrar una arquitectura preparada para escalar

La implementación es fácilmente intercambiable por Redis real o DynamoDB en AWS sin modificar la lógica de negocio.
