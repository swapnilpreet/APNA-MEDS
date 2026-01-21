🩺 Apna-Meds – AI-Powered Online Medicine & Healthcare Platform

Apna-Meds is a production-ready full-stack MERN healthcare platform that enables users to securely purchase medicines online, manage medical history, receive AI-based medicine recommendations, and complete payments, while providing pharmacy admins with a powerful RBAC-enabled admin panel for managing inventory, orders, users, and content at scale.

🌐 Live Demo

🔗 Frontend: (Add deployed URL)
🔗 Backend API: (Add API URL if public)

📸 Screenshots (Highly Important for Recruiters)

📌 Tip: Recruiters ALWAYS look at screenshots before code.

🏠 Home & Search

🤖 AI Medicine Recommendation

🩺 Medical History Management

🛒 Cart & Checkout

💳 Payment Flow

🧑‍💼 Admin Panel

👉 Upload images inside a screenshots/ folder in GitHub repo.

❓ Problem It Solves (Business + Healthcare Pain Points)

The healthcare and pharmacy industry struggles with fragmented medicine discovery, manual prescription handling, lack of digital medical records, limited personalization, poor inventory visibility, and delayed customer communication. Apna-Meds solves these real-world healthcare problems by offering a centralized, AI-enabled digital platform where users can securely sign up with email verification, store medical history, receive intelligent medicine recommendations based on health conditions, compare medicines, place online payments, and receive automated order confirmation emails. For pharmacy operators, it eliminates manual workflows through a secure admin panel, RBAC-based access, inventory management, image uploads, order lifecycle tracking, and automated notifications—resulting in improved efficiency, reduced errors, and scalable healthcare commerce operations.

🚀 Key Features (What Recruiters Look For)
👤 User Features

Email Signup & Verification

Secure Login / Logout (JWT)

Change & Reset Password (Email based)

AI-based medicine recommendation by condition

AI-recommended alternatives & substitutes

Add / Edit Medical History

Upload prescriptions & medical images

Advanced medicine search

Add reviews & ratings

Compare medicines

Add to cart & checkout

Online payment integration

Order tracking

Email notification after order

Profile & order history management

🛠️ Admin Features

Secure Admin Panel

Role-Based Access Control (RBAC)

Manage users & permissions

Add / Update / Delete medicines

Upload & manage medicine images

Inventory & stock control

Order management & status updates

Review moderation

Automated email notifications

🧠 AI Capabilities

Condition-based medicine recommendations

Smart medicine alternatives

Scalable AI integration layer

🧰 Tech Stack (Very Important for Recruiters)
Frontend

React.js

Redux Toolkit

Plain CSS / Styled-Components

React Icons

Backend

Node.js

Express.js

MongoDB & Mongoose

JWT Authentication

Bcrypt (Password Hashing)

Nodemailer (Emails)

AI Recommendation API / Logic

Other

Payment Gateway Integration

Git & GitHub

Postman

Vercel / Render Deployment

📂 Project Architecture
apna-meds/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   ├── styles/
│   └── App.jsx
│
├── screenshots/
├── .env
├── package.json
└── README.md

🔐 Security & Best Practices (Recruiters LOVE this section)

Email verification during signup

JWT authentication (Access & Refresh tokens)

Password hashing with bcrypt

Role-Based Access Control (RBAC)

Protected admin routes

Secure image uploads

Email-based password recovery

Order confirmation emails

🧪 API Highlights
Method	Endpoint	Description
POST	/api/users/register	Signup with email verification
POST	/api/users/login	Login
PUT	/api/users/password	Change password
POST	/api/ai/recommend	AI medicine suggestion
GET	/api/medicines	Fetch medicines
POST	/api/reviews	Add review
POST	/api/orders	Place order
PUT	/api/orders/:id	Update order (Admin)
⚙️ Environment Variables
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
PAYMENT_KEY=your_payment_gateway_key
AI_API_KEY=your_ai_api_key

▶️ Run Locally
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm start

📈 Future Enhancements

Doctor consultation module

Prescription verification

Invoice PDF generation

Push notifications

Mobile app (React Native)

Advanced AI health insights

👨‍💻 Author

Swapnil Ramteke
Full-Stack MERN Developer

⭐ If you find this project useful, please star the repository.
