# Client Manager

Web app quản lý client của công ty: thêm client, phân client cho BU (Business Unit). Xây bằng Next.js 14 + Neon Postgres, deploy trên Vercel.

## Tính năng

- Danh sách client (tìm kiếm, lọc theo BU)
- Thêm Client mới
- Quản lý BU (thêm/xóa)
- Phân Client cho BU (chọn trực tiếp trong bảng)
- Xóa client

## Triển khai (GitHub → Neon → Vercel)

### 1. Tạo database trên Neon

1. Vào https://neon.tech → tạo project mới (ví dụ: `client-manager`).
2. Vào tab **Connection Details**, copy chuỗi kết nối dạng:
   `postgresql://user:password@ep-xxxx.neon.tech/neondb?sslmode=require`
3. Lưu chuỗi này lại — sẽ dùng ở bước 3 và 4.

### 2. Đẩy code lên GitHub

```bash
cd client-manager
git init
git add .
git commit -m "Initial commit: client manager app"
git branch -M main
git remote add origin https://github.com/<your-username>/client-manager.git
git push -u origin main
```

### 3. Khởi tạo dữ liệu (schema + seed từ client-list.xlsx)

Trên máy local, với Node.js đã cài:

```bash
npm install
DATABASE_URL="<chuỗi kết nối Neon>" npm run seed
```

Lệnh này tạo bảng `clients`, `bus` và import 63 client có sẵn từ `client-list.xlsx`.

### 4. Deploy lên Vercel

1. Vào https://vercel.com → **Add New Project** → chọn repo `client-manager` vừa push.
2. Ở phần **Environment Variables**, thêm:
   - `DATABASE_URL` = chuỗi kết nối Neon (bước 1)
3. Bấm **Deploy**. Sau khi build xong, Vercel cấp cho bạn 1 URL (vd: `client-manager.vercel.app`).

### 5. Kiểm tra

Mở URL Vercel, kiểm tra: danh sách 63 client hiển thị đúng, thêm 1 client mới hoạt động, phân BU hoạt động.

## Chạy local (tùy chọn)

```bash
npm install
echo 'DATABASE_URL=<chuỗi kết nối Neon>' > .env.local
npm run dev
```

Mở http://localhost:3000
