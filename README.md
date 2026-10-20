# 💖 Chúc mừng 20/10 – Món quà nhỏ cho người thương

Trang web tặng người yêu nhân ngày Phụ nữ Việt Nam 20/10. Chỉ dùng HTML/CSS/JS thuần, không cần cài thư viện.

## ✨ Các màn

1. **Bé gấu hỏi:** "Em có phải cô gái đáng yêu nhất vũ trụ không?" – nút **Không** sẽ chạy trốn, nút **Có** to dần 😜
2. **Phong thư** lắc lư, chạm vào là mở
3. **Lá thư tay** hiện từng chữ như đang gõ (chạm vào để hiện hết luôn)
4. **Trái tim hạt phát sáng** đập theo nhịp, có tên em ở giữa và **bộ đếm số ngày yêu nhau**
5. **Hộp quà** lật ra các "phiếu yêu thương"
6. **Màn kết** có pháo hoa trái tim, ảnh polaroid (tùy chọn) và lời nhắn

Ngoài ra: tim & hoa bay khắp nền, chạm chỗ nào nổ tim chỗ đó, có nhạc nền (tùy chọn).

## 🛠️ Cá nhân hóa

Sửa file **`config.js`**: tên, ngày bắt đầu yêu, câu hỏi, lá thư, các phiếu quà, lời kết.

- **Nhạc nền:** bỏ file `music.mp3` vào thư mục `assets/` (nếu không có, nút nhạc tự ẩn).
- **Ảnh chung:** bỏ ảnh vào `assets/` rồi ghi `photo: "assets/us.jpg"`.

## 💻 Chạy trên máy

Cách nhanh nhất: mở file `index.html` bằng Chrome/Edge (bấm đúp).

Hoặc chạy server nhỏ (giống lúc lên mạng hơn):

```bash
npx serve .
# hoặc
python -m http.server 8000
```

Rồi vào `http://localhost:3000` (serve) hoặc `http://localhost:8000` (python).

## 🚀 Đưa lên GitHub Pages

```bash
git init
git add .
git commit -m "Qua 20/10 cho em"
git branch -M main
git remote add origin https://github.com/<ten-github>/<ten-repo>.git
git push -u origin main
```

Sau đó vào repo trên GitHub → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
Đợi khoảng 1 phút (xem tab **Actions**), trang sẽ có ở:

```
https://<ten-github>.github.io/<ten-repo>/
```

Gửi link cho em và chờ em cười thôi 🥰
