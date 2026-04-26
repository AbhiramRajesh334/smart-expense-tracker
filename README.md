# SpendWise 💳

**A modern, full-stack expense tracking application with intelligent analytics and a premium dark-themed UI.**

SpendWise helps you take control of your finances by providing an intuitive platform to securely log, categorize, and analyze your daily expenses. With dynamic time-based visualizations and a beautifully crafted user interface, managing your money has never looked this good.

## ✨ Features

### Core Features
- **User Authentication**: Secure signup and login using JWT (JSON Web Tokens).
- **Expense Management**: Full CRUD capabilities (Create, Read, Update, Delete) for your expenses.
- **Categorization**: Organize expenses automatically with smart color-coded badges (Food, Transport, Utilities, Shopping, etc.).
- **Responsive Layout**: A modern sidebar navigation and dynamic grid layout that looks perfect on both desktop and mobile.

### Advanced Features
- **Real-time Analytics Dashboard**: Instantly calculates total spending, transaction count, and your highest spending category.
- **Time-based Data Visualization**: Interactive charts powered by `recharts`.
  - **Daily Insights**: Bar charts displaying today's spending breakdown.
  - **Weekly Trends**: Line charts tracking your daily spending habits across every week of the current month.
  - **Monthly Comparisons**: Historical bar charts comparing your total expenses over the last 3 months.
- **AI Insights (Upcoming)**: A dedicated section for intelligent financial recommendations.

## 🛠 Tech Stack

**Frontend:**
- React.js (via Vite)
- React Router DOM
- Recharts (Data Visualization)
- Vanilla CSS (Custom dark-mode SaaS UI)

**Backend:**
- Node.js
- Express.js
- JSON Web Token (JWT)
- bcryptjs (Password hashing)

**Database:**
- MongoDB
- Mongoose (ODM)

## 📁 Project Structure

```text
spendwise/
├── client/          # React Frontend application
│   ├── public/      # Static assets
│   ├── src/
│   │   ├── components/ # Reusable UI components (Sidebar, Layout)
│   │   ├── pages/      # Route pages (Dashboard, Analytics, Login, etc.)
│   │   └── index.css   # Global theme variables
│   └── package.json
└── server/          # Node.js / Express Backend application
    ├── controllers/ # Request handlers for auth and expenses
    ├── middleware/  # JWT authentication middleware
    ├── models/      # Mongoose schemas (User, Expense)
    ├── routes/      # API route definitions
    └── server.js    # Entry point
```

## 🚀 Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone https://github.com/AbhiramRajesh334/smart-expense-tracker.git
cd smart-expense-tracker
```

### 2. Setup the Backend
Open a new terminal window:
```bash
cd server
npm install
```
Create a `.env` file in the `/server` directory (see Environment Variables below).
Start the backend server:
```bash
npm start
# or use nodemon for development:
# npm run dev
```

### 3. Setup the Frontend
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```
The application should now be running at `http://localhost:5173`.

## ⚙️ Environment Variables

Create a `.env` file inside the `/server` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate user & receive JWT

### Expenses (Protected Routes - Requires JWT)
- `GET /api/expenses` - Retrieve all user expenses
- `POST /api/expenses` - Add a new expense
- `DELETE /api/expenses/:id` - Delete an expense

### AI Insights (Upcoming)
- `GET /api/insights` - Generate personalized financial tips

## 📸 Screenshots

*(Add screenshots of your application here)*

| Dashboard | Analytics |
| :---: | :---: |
| ![Dashboard Placeholder](https://via.placeholder.com/600x350?text=Dashboard+UI) | ![Analytics Placeholder](https://via.placeholder.com/600x350?text=Analytics+Charts) |

## 🔮 Future Improvements

- **AI Insights**: Integrate OpenAI/Gemini to provide smart financial recommendations based on spending history.
- **Smart Search & Filtering**: Advanced multi-parameter search (date ranges, precise category filtering).
- **Budget Alerts**: Set monthly budget limits per category and receive visual warnings.
- **Export to CSV/PDF**: Allow users to download their expense reports.

## 🌍 Deployment

- **Frontend**: Can be easily deployed to [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).
- **Backend**: Suitable for deployment on [Render](https://render.com/), [Railway](https://railway.app/), or [Heroku](https://www.heroku.com/).
- **Database**: Use [MongoDB Atlas](https://www.mongodb.com/atlas/database) for a free cloud database cluster.

---
*Built with ❤️ for better financial health.*
