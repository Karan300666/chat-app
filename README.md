# AI Chat Application

A real-time AI-powered chat application built with React, Node.js, Express, and Socket.io. Users can create projects and engage in conversations with AI using Google's Generative AI.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Project Management**: Create and manage multiple chat projects
- **Real-time Chat**: Instant messaging with AI using Socket.io
- **AI Integration**: Powered by Google's Generative AI (Gemini)
- **Responsive Design**: Modern UI built with React and Tailwind CSS
- **Email Notifications**: User registration confirmation via Nodemailer

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Redis** for caching
- **Socket.io** for real-time communication
- **JWT** for authentication
- **Google Generative AI** for AI responses
- **Nodemailer** for email services

### Frontend
- **React** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for HTTP requests
- **Socket.io Client** for real-time features

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v16 or higher)
- MongoDB
- Redis
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-chat
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ai-chat
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret-key
GOOGLE_AI_API_KEY=your-google-ai-api-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

## Running the Application

1. **Start MongoDB and Redis** (if not already running)

2. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The server will run on http://localhost:3000

3. **Start the Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout

### Projects
- `POST /api/project/create` - Create a new project
- `GET /api/project/all` - Get all user projects

### AI Chat
- `POST /api/ai/chat` - Send message to AI

## Usage

1. Register a new account or login with existing credentials
2. Create a new project from the dashboard
3. Start chatting with the AI in real-time
4. Create multiple projects for different conversations

## Project Structure

```
ai-chat/
├── backend/
│   ├── src/
│   │   ├── controller/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── service/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── auth/
│   │   ├── config/
│   │   ├── context/
│   │   ├── screen/
│   │   └── assets/
│   ├── package.json
│   └── index.html
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.