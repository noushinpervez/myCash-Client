# myCash

## Project Overview

**myCash** is a web-based Mobile Financial Service (MFS) platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It functions similarly to platforms like bKash or Nagad, built using the MERN stack: React.js, Node.js, Express.js, and MongoDB. The system has three roles: **User**, **Agent** and **Admin**. Key features include user registration, secure login, money transfer, cash-out, cash-in, balance inquiry, and transaction history.

## Key Features

- User and Agent registration with 5-digit PIN (hashed using bcrypt.js) and admin approval.
- Secure login via Mobile Number/Email and PIN using JWT authentication.
- New users receive a 40 Taka bonus; new agents receive a 10,000 Taka bonus upon admin approval.
- Users can send money to other users with a minimum transaction of 50 Taka. A fee of 5 Taka applies to transactions over 100 Taka.
- Users can cash out via agents, with a 1.5% fee deducted from the user balance and added to agent balance.
- Agents can handle cash-in and cash-out requests, updating both user and agent balances accordingly.
- Users can request cash-in via agents, with no fee applied.
- All users can check their balance at any time.
- Users can view the last 10 transactions, while agents can view the last 20 transactions.
- Admins can manage users and agents, activate or block accounts, and monitor all system transactions.

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript, React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens), `bcrypt.js` for PIN hashing

## Credentials
### Admin
- **Email:** admin@gmail.com
- **Phone:** 01800000000
- **Password:** 12345

### Agent
- **Email:** user@gmail.com
- **Phone:** 01777777777
- **Password:** 12345

## Live Site
[Visit myCash](https://mycash-mfs.netlify.app/)

## Server Repository
[myCash Server Repository](https://github.com/noushinpervez/myCash-Server)

## Installation & Setup

### Prerequisites
- Node.js and npm installed
- MongoDB installed or access to MongoDB Atlas for cloud-based database
- A modern web browser for the client

### Step-by-Step Instructions

1. **Clone the repositories:**
   ```bash
   git clone https://github.com/noushinpervez/myCash-Client.git
   git clone https://github.com/noushinpervez/myCash-Server.git
   ```

2. **Navigate to the server project directory and install dependencies:**
   ```bash
   cd myCash-Server
   npm install
   ```

3. **Navigate to the client project directory and install dependencies:**
   ```bash
   cd myCash-Client
   npm install
   ```
   
4. **Set up environment variables:**
   - Create a `.env` file in the `myCash-Server` directory and add necessary configuration variables:
     ```env
     DB_USER=
     DB_PASS=
     JWT_SECRET=
     ```
   - Replace each variable with your actual configuration keys and values **without quotations**.

5. **Run the backend server:**
   ```bash
   node index.js
   ```

6. **Run the frontend client:**
   ```bash
   npm run dev
   ```

7. **Access the application:**
   - Frontend should be accessible at `http://localhost:5173`.
   - Backend API runs on `http://localhost:5000`.

Follow these instructions to set up and locally run the client and server of **myCash** to explore its features and functionalities.