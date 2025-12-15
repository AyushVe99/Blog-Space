# BlogSpace - Modern Blogging Platform

A full-stack blogging application built with the MERN stack (MongoDB, Express.js, React/Next.js, Node.js) and TypeScript. This project features a robust backend API and a modern, responsive frontend.

##  Features

-   **User Authentication**: Secure registration and login using JWT (JSON Web Tokens) with HttpOnly cookie storage for enhanced security.
-   **Blog Management**: Create, read, and manage blog posts with rich text content.
-   **Categories**: Organize blogs into categories for easy navigation.
-   **Search & Filter**: Search blogs by keyword or filter by category.
-   **Engagement**:
    -   **Comments**: Users can leave comments on blog posts.
    -   **Likes**: Users can like blog posts and comments.
-   **User Dashboard**: View personal statistics (total views, followers) and recent activity.
-   **Profile Page**: View and manage user profile details.
-   **Responsive Design**: A beautiful, mobile-first UI built with Tailwind CSS and Lucide Icons.
-   **Dark Mode**: (If applicable, mention if the UI supports it based on Tailwind classes saw earlier 'dark:text-white')

##  Tech Stack

### Backend
-   **Node.js & Express.js**: RESTful API server.
-   **MongoDB & Mongoose**: NoSQL database for flexible data modeling.
-   **TypeScript**: Static typing for better code quality and developer experience.
-   **JWT & bcryptjs**: Secure authentication and password hashing.

### Frontend
-   **Next.js (App Router)**: React framework for server-side rendering and routing.
-   **Redux Toolkit**: State management for authentication and user data.
-   **Tailwind CSS**: Utility-first CSS framework for styling.
-   **Axios**: HTTP client for API requests.
-   **Lucide React**: Beautiful, consistent icons.

##  Prerequisites

Before you begin, ensure you have the following installed:
-   **Node.js** (v14 or higher)
-   **npm** or **yarn**
-   **MongoDB**: Make sure you have a local instance running or a MongoDB Atlas connection string.

##  Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Ayush30012000/Blog-Space.git
cd Blogging Website
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/blogspace  # Or your MongoDB Atlas URI
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

**Seed the Database (Optional):**
To populate the database with initial categories:

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
```
The server will start on `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

## 🏃‍♂️ Running the Project

1.  Ensure your MongoDB database is running.
2.  Start the **Backend**:
    ```bash
    cd backend
    npm run dev
    ```
3.  Start the **Frontend**:
    ```bash
    cd frontend
    npm run dev
    ```
4.  Open your browser and visit `http://localhost:3000`.

## 📁 Project Structure

```
Blogging Website/
├── backend/                # Express API Server
│   ├── src/
│   │   ├── config/         # DB connection
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth & Error middleware
│   │   ├── models/         # Mongoose models (User, Blog, Comment)
│   │   ├── routes/         # API routes
│   │   └── ...
│   └── ...
└── frontend/               # Next.js Application
    ├── src/
    │   ├── app/            # Next.js App Router pages
    │   ├── components/     # Reusable UI components
    │   ├── lib/            # Utilities (API client)
    │   ├── store/          # Redux store slices
    │   └── ...
    └── ...
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
