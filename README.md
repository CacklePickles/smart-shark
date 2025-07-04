# Smart Shark - Cybersecurity Dashboard

Smart Shark is a web-based cybersecurity dashboard that provides real-time threat monitoring, malware scanning, and phishing detection capabilities.

## Features

- 🔒 Secure Authentication (JWT-based)
- 🛡️ Malware Scanning Module
- 🎣 AI-based Phishing Detection
- 📊 Real-time Threat Dashboard
- 🔔 WebSocket-based Alerts
- 📱 Responsive Design

## Tech Stack

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- JWT Authentication
- WebSocket

### Frontend
- React
- Material-UI
- TypeScript
- Chart.js
- Axios

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone https://github.com/CacklePickles/smart-shark.git
cd smart-shark
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-shark
JWT_SECRET=your-secret-key
```

5. Start the development servers:

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
smart-shark/
├── backend/           # Node.js + Express + TypeScript backend
│   ├── src/
│   │   ├── config/   # Configuration files
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
└── frontend/         # React + Vite frontend
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── utils/
    │   └── types/
    └── package.json
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/profile - Get user profile

### Malware Scan
- POST /api/scan/start - Start a new scan
- GET /api/scan/history - Get scan history
- GET /api/scan/:id - Get scan details

### Phishing Detection
- POST /api/phishing/analyze - Analyze URL for phishing
- GET /api/phishing/history - Get analysis history

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- CORS protection
- Secure HTTP headers
- Rate limiting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. #   s m a r t - s h a r k  
 