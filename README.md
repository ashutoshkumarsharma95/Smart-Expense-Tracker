# 💰 Smart Expense Tracker

A web-based expense management application designed to help users track their income and expenses, monitor their financial balance, and visualize their spending habits through interactive charts.

Built using **HTML, CSS, JavaScript, Node.js, Express.js, and IBM Cloudant**.

---

## 📌 Project Overview

Smart Expense Tracker is a full-stack web application that provides a simple and interactive platform for managing daily financial transactions.

Users can add income and expense records, update or delete transactions, view their financial summaries, and analyze their spending patterns through graphical representations.

The application uses **IBM Cloudant**, a cloud-based NoSQL database, to store transaction data persistently.

## ✨ Features

- **Dashboard:** View total balance, total income, and total expenses.
- **Add Transactions:** Record income and expenses with title, amount, category, date, and notes.
- **Transaction Management:** Edit and delete existing transactions.
- **Transaction History:** View all recorded transactions.
- **Monthly Filtering:** Filter transactions based on a selected month.
- **Interactive Charts:** Visualize monthly income and expenses using bar charts.
- **Category Analysis:** Analyze expense distribution through a doughnut chart.
- **Currency Settings:** Change the currency symbol.
- **Dark Mode:** Switch between light and dark themes.
- **Cloud Database:** Store transaction records using IBM Cloudant.
- **REST API:** Communicate between frontend and backend using RESTful API endpoints.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling and responsive design |
| JavaScript | Frontend functionality |
| Node.js | Backend runtime environment |
| Express.js | Backend framework and REST APIs |
| IBM Cloudant | Cloud-based NoSQL database |
| Chart.js | Interactive charts |
| Git & GitHub | Version control and project hosting |

## 🏗️ System Architecture

The project follows a **Monolithic Architecture**.

The frontend communicates with the Express.js backend through REST API requests. The backend processes these requests and interacts with IBM Cloudant to store, retrieve, update, and delete transaction records.

```text
       USER
        |
        v
  FRONTEND
 HTML + CSS + JavaScript
        |
        | HTTP / REST API
        v
  BACKEND
  Node.js + Express.js
        |
        v
  ROUTES
        |
        v
  CONTROLLERS
        |
        v
  SERVICES
        |
        v
  IBM CLOUDANT
   NoSQL Database
```

## 📁 Project Folder Structure

```text
Smart-Expense-Tracker/
│
├── Backend/
│   │
│   ├── config/
│   │   ├── cloudant.js
│   │   └── database.js
│   │
│   ├── controllers/
│   │   └── transactionController.js
│   │
│   ├── middleware/
│   │
│   ├── routes/
│   │   └── transactionRoutes.js
│   │
│   ├── services/
│   │   └── transactionService.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   ├── testCloudant.js
│   └── createDatabase.js
│
├── Frontend/
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── api.js
│   │   └── app.js
│   │
│   └── index.html
│
├── .gitignore
└── README.md
```

## ☁️ IBM Cloud Services

### IBM Cloudant

IBM Cloudant is used as the cloud database for storing transaction information.

**Database Name:** `expense_tracker`

**Purpose:**
- Store income and expense records.
- Retrieve transaction history.
- Update existing transactions.
- Delete transaction records.
- Maintain data even after restarting the backend server.

### Cloudant Configuration

The backend connects to IBM Cloudant using API key authentication.

Credentials are stored in a local `.env` file and are not included in the GitHub repository.

## 🗄️ Database Design

The application stores transaction records as JSON documents in IBM Cloudant.

### Example Transaction Document

```json
{
  "_id": "transaction_001",
  "type": "expense",
  "userId": "demo_user",
  "title": "Lunch",
  "amount": 150,
  "category": "Food",
  "date": "2026-11-17",
  "notes": "College canteen"
}
```

### Transaction Fields

| Field | Description |
|---|---|
| `_id` | Unique document identifier |
| `type` | Income or expense |
| `userId` | Demo user identifier |
| `title` | Transaction title |
| `amount` | Transaction amount |
| `category` | Transaction category |
| `date` | Transaction date |
| `notes` | Additional information |

## 🔗 REST API Endpoints

The backend provides the following API endpoints:

**Base URL:** `http://localhost:5000/api/transactions`

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/api/transactions` | Get all transactions |
| GET | `/api/transactions/:id` | Get transaction by ID |
| POST | `/api/transactions` | Add a new transaction |
| PUT | `/api/transactions/:id` | Update a transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |

## ⚙️ Installation and Setup

Follow these steps to run the project locally.

### Prerequisites

Install the following software:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- An IBM Cloud account with an IBM Cloudant service instance and database.

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/Smart-Expense-Tracker.git
```

Navigate into the project directory:

```bash
cd Smart-Expense-Tracker
```

### 2. Install Backend Dependencies

```bash
cd Backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `Backend` folder.

Add the following configuration:

```env
PORT=5000

CLOUDANT_URL=your_cloudant_service_url
CLOUDANT_APIKEY=your_cloudant_api_key
```

Replace the placeholder values with your own IBM Cloudant credentials.

**Important:** Never upload your actual `.env` file or API keys to GitHub.

### 4. Create the Cloudant Database

Make sure your Cloudant service is configured correctly.

Run:

```bash
node createDatabase.js
```

This creates the `expense_tracker` database if it does not already exist.

### 5. Start the Backend Server

Run:

```bash
npm start
```

Expected output:

```text
Server running on port 5000
```

### 6. Open the Frontend

Open the `Frontend/index.html` file in your browser.

You can also use the Live Server extension in Visual Studio Code.

The frontend communicates with the backend running on port `5000`.

## 🧪 Testing

The application can be tested using the following methods:

- **Browser:** Test the dashboard, forms, transaction history, charts, filters, and settings.
- **Postman:** Test REST API endpoints for creating, retrieving, updating, and deleting transactions.
- **IBM Cloudant Dashboard:** Verify that transaction documents are stored correctly.
- **Browser Developer Tools:** Inspect JavaScript errors and network requests.

## 🔐 Security Notes

- Cloudant credentials are stored in environment variables.
- `.env` files are excluded through `.gitignore`.
- `node_modules` folders are excluded from GitHub.
- The current version uses a demo user identifier (`demo_user`).
- Authentication and per-user authorization are not yet implemented.

**Note:** The current version is intended for local demonstration and development. Do not use it for real sensitive financial information or public multi-user deployment until authentication and proper access control are implemented.

## 🚀 Future Enhancements

The following features can be added in future versions:

- User registration and login using IBM App ID.
- Individual user accounts and transaction isolation.
- Monthly budget management.
- Budget limit notifications and warnings.
- Transaction search and advanced filtering.
- Export transaction reports to CSV.
- Improved financial analytics.
- Cloud deployment.

## 🎯 Learning Outcomes

Through this project, the following concepts and technologies are explored:

- Full-stack web application development.
- Frontend and backend integration.
- REST API development using Express.js.
- CRUD operations.
- Cloud database integration using IBM Cloudant.
- Environment variable configuration.
- Data visualization using Chart.js.
- Git and GitHub version control.

## 📄 License

This project is developed for educational and academic purposes.

