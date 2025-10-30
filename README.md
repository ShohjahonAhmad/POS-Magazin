🧾 Express Backend API

This is a Node.js + Express.js backend application designed to handle authentication, sales, products, expenses, statistics, and user management for a business system. It uses JWT authentication, cookie-based sessions, and includes middleware for error handling and route protection.

🚀 Features

🔐 Authentication system with JWT tokens

👥 User management (foydalanuvchilar)

📊 Statistics module (statistika)

💰 Sales & Expenses tracking (sotuvlar, rasxodlar)

🏷️ Product and Category management (mahsulotlar, kategoriyalar)

⚙️ Centralized error handling and 404 middleware

🕒 Automated cleanup of expired tokens using a scheduled background task

📁 Project Structure
project/
├── routers/
│   ├── auth.js
│   ├── foydalanuvchilar.js
│   ├── mahsulotlar.js
│   ├── rasxodlar.js
│   ├── sotuvlar.js
│   ├── statistika.js
│   └── kategoriyalar.js
├── middleware/
│   ├── authenticate.js
│   ├── authenticated.js
│   ├── errorHandler.js
│   └── notFound.js
├── utils/
│   └── deleteExpiredTokens.js
├── .env
├── package.json
├── server.js (or index.js)
└── README.md

⚙️ Installation
1. Clone the repository
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name

2. Install dependencies
npm install

3. Create a .env file

Create a .env file in the project root and define your environment variables:

PORT=5000
JWT_SECRET=your_jwt_secret_key
DB_URI=your_database_connection_uri
TOKEN_EXPIRATION=1d


Adjust variables as needed for your setup.

▶️ Running the Server
Development mode (with nodemon)
npm run dev

Production mode
npm start


After starting, the server should be available at:
👉 http://localhost:5000

🔗 API Routes
Method	Endpoint	Description	Auth Required
GET	/	Health check	❌
POST	/auth/register	Register new user	❌
POST	/auth/login	Login user	❌
POST	/auth/logout	Logout user	✅
GET	/foydalanuvchilar	Get all users	✅
GET	/mahsulotlar	Get products	✅
GET	/kategoriyalar	Get categories	✅
GET	/rasxodlar	Get expenses	✅
GET	/sotuvlar	Get sales	✅
GET	/statistika	Get statistics	✅

(Routes may vary based on router implementation.)

🧰 Middleware

authenticate.js → Verifies if JWT token exists and is valid

authenticated.js → Ensures user permissions/roles

errorHandler.js → Centralized error response handler

notFound.js → Handles non-existent routes gracefully

🕓 Background Tasks

A scheduled background task (deleteExpiredTokens.js) automatically removes expired tokens to keep the system secure and efficient.

🧑‍💻 Contributing

Fork this repo

Create your feature branch: git checkout -b feature/my-feature

Commit changes: git commit -m 'Add new feature'

Push to branch: git push origin feature/my-feature

Open a Pull Request

🪪 License

This project is licensed under the MIT License — you’re free to use, modify, and distribute it.

📞 Contact

If you have questions or suggestions, feel free to reach out:
📧 your.email@example.com

🌐 GitHub Profile
