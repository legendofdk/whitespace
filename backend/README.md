# Backend CMS

Backend được tách riêng để phục vụ CMS/admin và API nội bộ, không ảnh hưởng frontend Next.js hiện tại.

## Structure

```text
backend/
  prisma/
  src/
    config/
    lib/
    middlewares/
    modules/
    routes/
```

## Modules khởi tạo

- `auth`
- `projects`
- `land-listings`
- `rentals`
- `posts`
- `media`
- `contacts`

## Giai đoạn tiếp theo

1. `npm install` trong `backend/`
2. Tạo database PostgreSQL
3. Chạy `prisma generate`
4. Viết CRUD thật cho từng module
