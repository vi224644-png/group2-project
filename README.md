# Group 2 Project – Node.js + React + MongoDB

---

## Mô tả dự án

Dự án **Group 2 Project** được xây dựng nhằm thực hành quy trình phát triển ứng dụng web **Fullstack MERN** (MongoDB, Express, React, Node.js).  
Ứng dụng cho phép **quản lý người dùng (User Management)** với các chức năng cơ bản:
- Xem danh sách người dùng
- Thêm người dùng mới
- Chỉnh sửa thông tin người dùng
- Xóa người dùng

Dự án được chia thành 3 phần chính:
- **Backend:** xử lý API bằng Node.js + Express  
- **Frontend:** giao diện React kết nối API qua Axios  
- **Database:** lưu dữ liệu người dùng bằng MongoDB Atlas  

Mục tiêu:
- Làm quen với kiến trúc client-server và RESTful API  
- Quản lý mã nguồn bằng Git và GitHub (phân nhánh, Pull Request, merge)  
- Thực hành làm việc nhóm trong môi trường phát triển phần mềm

---

## Công nghệ sử dụng

| Thành phần | Công nghệ / Thư viện |
|-------------|----------------------|
| **Ngôn ngữ** | JavaScript (ES6+) |
| **Backend** | Node.js, Express.js, Nodemon, dotenv |
| **Frontend** | React.js, Axios, Hooks |
| **Database** | MongoDB Atlas, Mongoose |
| **Quản lý mã nguồn** | Git, GitHub |
| **Công cụ phát triển** | VS Code, Postman |

## Hướng dẫn chạy
B1: Vào folder muốn lưu project, mở Git Bash clone repo về: 
        git clone https://github.com/vi224644-png/group2-project.git
    Sau đó di chuyển vào project:
        cd group2-project
B2: Di chuyển vào thư mục backend:
        cd backend
    Cài các gói dữ liệu:
        npm install
    Sau khi cài xong chạy file server.js;
        node server.js
B3: Mở thêm 1 Git Bash rồi di chuyển vào thư mục frontend cài gói dữ liệu tương tự backend
    Sau khi cài xong khởi chạy frontend:
        npm start

## Phân chia công việc

222786 Nguyễn Hoàng Phúc làm backend:
    - Tạo cấu trúc Node.js + Express
    - Viết REST API (GET, POST, PUT, DELETE)
224114 Nguyễn Quốc Tánh làm frontend
    - Tạo giao diện React
    - Kết nối API + quản lý state
224644 Phạm Trần Tuấn Vĩ làm database
    -Thiết lập MongoDB Atlas
    -Tạo Model + tích hợp với API