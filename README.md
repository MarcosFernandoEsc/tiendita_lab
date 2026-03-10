# Tiendita PG Lab

Aplicacion demo de una tiendita conectada a PostgreSQL para practicar pruebas de seguridad en un entorno controlado.

## Stack

- Node.js + Express
- PostgreSQL (administrable con pgAdmin)
- Frontend HTML/CSS/JS simple

## 1) Requisitos

- Node.js 18+
- PostgreSQL 14+ (o similar)
- pgAdmin (opcional, para administrar la base)

## 2) Crear base de datos en PostgreSQL

Puedes hacerlo en pgAdmin o con SQL:

```sql
CREATE DATABASE tiendita_lab;
```

Luego ejecuta el script `database/init.sql` en esa base.

## 3) Configurar variables de entorno

1. Duplica `.env.example` como `.env`
2. Ajusta credenciales segun tu PostgreSQL

## 4) Instalar y correr

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## 5) Endpoints

- `GET /api/health` Estado de API + DB
- `GET /api/products` Lista de productos
- `POST /api/orders` Crea pedido

Ejemplo de body para pedido:

```json
{
  "customer_name": "Marco",
  "customer_email": "marco@example.com",
  "items": [
    { "product_id": 1, "quantity": 2 }
  ]
}
```

## 6) Subir a GitHub

```bash
git init
git add .
git commit -m "feat: tiendita postgres demo"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

## 7) Incluir la base de datos para compartir

Ya incluyes un esquema reproducible en `database/init.sql`. Si quieres compartir tambien una copia completa de datos, agrega un dump.

### Exportar dump desde pgAdmin

1. Click derecho en la base `tiendita_lab` -> `Backup...`
2. `Format`: `Plain`
3. `Filename`: `database/tiendita_lab_dump.sql`
4. Click en `Backup`

Luego subelo al repo:

```bash
git add database/tiendita_lab_dump.sql
git commit -m "chore: add database dump"
git push
```

### Restaurar dump (otra persona)

1. Crear una base vacia (por ejemplo `tiendita_lab`)
2. En pgAdmin abrir `Query Tool` sobre esa base
3. Cargar y ejecutar `database/tiendita_lab_dump.sql`

Si no compartes dump, al menos deben ejecutar `database/init.sql` para crear tablas y datos semilla.

## 8) Como compartir el proyecto

Si el repositorio es `Public`, normalmente si basta con pasar el link de GitHub.

Checklist minimo para compartir:

- Link del repo: `https://github.com/TU_USUARIO/TU_REPO`
- Instrucciones del `README.md`
- Confirmar que `.env` no esta en GitHub (solo `.env.example`)
- Opcional: incluir `database/tiendita_lab_dump.sql` si quieres que levanten exactamente tus datos

## Nota de seguridad

Usa esta app solo para pruebas autorizadas. No hagas pruebas en sistemas de terceros sin permiso explicito.
