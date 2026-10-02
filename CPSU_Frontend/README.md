# Frontend - ระบบจัดการเนื้อหาภาควิชาคอมพิวเตอร์

Frontend ของโครงงานปริญญานิพนธ์  
**เรื่อง : การพัฒนาเว็บไซต์และระบบจัดการเนื้อหาภาควิชาคอมพิวเตอร์**

พัฒนาด้วย React เพื่อแสดงผลข้อมูลจาก Backend API และรองรับผู้ใช้งานหลายบทบาท (Admin / Rootadmin / Teacher / Public)

---

## ภาพรวมระบบ

Frontend ทำหน้าที่เป็นส่วนติดต่อผู้ใช้ (User Interface) สำหรับ
- ผู้ใช้งานทั่วไป (Public)
- ผู้ดูแลระบบ (Admin)
- อาจารย์ (Teacher)

โดยเชื่อมต่อกับ Backend ผ่าน REST API

---

## โครงสร้างของ Frontend

1. **node_modules**  
   - ใช้เก็บ package หรือ library ที่ติดตั้งจากคำสั่ง `npm install`  

2. **public**  
   - ใช้เก็บไฟล์ static ที่ React จะนำไปใช้งานโดยตรง  
   - เช่น  
     - `index.html` → ไฟล์หลักที่ใช้ render React  
     - รูปภาพ / icon / ไฟล์อื่น ๆ  

3. **src (โค้ดหลักของระบบ)**  
   ภายในประกอบไปด้วยส่วนต่าง ๆ ดังนี้

   - **api**  
     - ใช้จัดการการเรียก API ไปยัง backend  

   - **auth**  
     - ใช้จัดการระบบ authentication และ authorization  

   - **component**  
     - ใช้เก็บ Component ที่สามารถนำกลับมาใช้ซ้ำได้  
     - เช่น Navbar, Header, Footer เป็นต้น  

   - **css**  
     - ใช้เก็บไฟล์ CSS สำหรับตกแต่ง UI  
     - มีการแยกส่วนเพื่อให้ง่ายต่อการจัดการ  

   - **layout**  
     - ใช้กำหนดโครงสร้าง layout ของหน้า  

   - **page**  
     - ใช้เก็บหน้าต่าง ๆ ของระบบ โดยแบ่งตามประเภทผู้ใช้งาน  
       - `admin/rootadmin` → หน้าจัดการข้อมูล (CRUD)  
       - `teacher` → หน้าของอาจารย์  
       - `public` → หน้า homepage, news, course  

   - **App.js**  
     - ใช้กำหนด routing หลักของระบบ และเชื่อมแต่ละ page เข้าด้วยกัน  

   - **index.js**  
     - เป็นไฟล์เริ่มต้นของ React และใช้ render App ลงบนหน้าเว็บ  

4. **.gitignore**  
   - ใช้กำหนดไฟล์/โฟลเดอร์ที่ไม่ต้องการให้ Git track  
   - เช่น `node_modules`, `.env`  

5. **package.json**  
   - ใช้เก็บรายละเอียดของโปรเจกต์  
   - เช่น dependencies (React, Axios) และ scripts (start, build)  

6. **package-lock.json**  
   - ใช้ล็อกเวอร์ชันของ package เพื่อให้ทุกคนในทีมใช้เวอร์ชันเดียวกัน  

---

## วิธีการใช้งาน Frontend

1. เปิดโปรแกรม Visual Studio Code  

2. เปิดโฟลเดอร์ `Frontend`  

3. เปิด Terminal  

4. ติดตั้ง dependencies ของโปรเจกต์  
```bash
npm install
```

5. รันระบบ Frontend
```bash
npm start
```

6. เข้าใช้งานผ่านเว็บเบราว์เซอร์
```bash
http://localhost:3000
```

---

## หมายเหตุ
- ต้องติดตั้ง Node.js ก่อนใช้งาน
- ควรรัน Backend ก่อน เพื่อให้ Frontend สามารถเรียก API ได้
- หากพอร์ต 3000 ถูกใช้งานอยู่ ระบบจะมีการแจ้งเตือนเพื่อเปลี่ยนพอร์ต