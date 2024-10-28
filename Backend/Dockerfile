# Sử dụng image Node.js chính thức
FROM node:14

# Tạo thư mục làm việc trong container
WORKDIR /usr/src/app

# Copy tệp package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các dependencies cho dự án
RUN npm install

# Copy toàn bộ mã nguồn vào thư mục làm việc
COPY . .

# Expose cổng mà ứng dụng sẽ sử dụng
EXPOSE 3000

# Khởi chạy ứng dụng
CMD [ "node", "server.js" ]
