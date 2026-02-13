# Real-Time Chat Application

Low-latency real-time messaging platform built with WebSockets and Redis, with presence tracking and persistent message storage.

## About

Real-Time Chat Application | WebSockets, Redis
- Developed low-latency real-time messaging with user presence tracking and message persistence.

## Output Screenshots

### Desktop Output
![Desktop Output](https://raw.githubusercontent.com/sepalsagar/Real-Time-Chat-Application/main/screenshots/output-desktop.png)

### Mobile Output
![Mobile Output](https://raw.githubusercontent.com/sepalsagar/Real-Time-Chat-Application/main/screenshots/output-mobile.png)

## Key Features

- WebSocket-based one-to-one live messaging
- Redis-backed presence (`online/offline/lastSeen`)
- Message persistence in PostgreSQL via Prisma
- Offline-safe delivery model:
  - message is always persisted
  - status marked `Delivered` if recipient socket is connected, else `Pending`
- Conversation history API with pagination
- Health endpoint for deployment checks

## Core APIs (User Service)

- `GET /healthz`
- `GET /api/v1/user/presence/:userId`
- `GET /api/v1/messages/:userId/:otherUserId?page=1&limit=20`

WebSocket payload (client -> server):
```json
{
  "type": "chat",
  "receiverId": "<user-id>",
  "content": "hello"
}
```

WebSocket response (server -> clients):
```json
{
  "type": "chat",
  "data": {
    "messageId": "...",
    "senderId": "...",
    "receiverId": "...",
    "content": "hello",
    "status": "Delivered"
  }
}
```

## Tech Stack

- Node.js + TypeScript
- WebSockets (`ws`)
- Redis
- PostgreSQL + Prisma
- Express

## Project Layout

- `Backend/user_service` - REST + WebSocket + persistence
- `Backend/ws-manager` - Redis/Kafka coordination (existing service)
- `Backend/ws-server-1` - websocket worker (existing service)
- `Frontend/myApp` - frontend client

## Local Setup

1. Start infrastructure and user service:
```bash
docker compose up --build
```

2. Copy env for local non-docker run:
```bash
cd Backend/user_service
cp .env.example .env
npm install
npm run dev
```

## Database

- Prisma schema: `Backend/user_service/prisma/schema.prisma`
- Run migrations/generate per your local DB workflow.

## Vercel Hosting

For API hosting, use the Node service under `Backend/user_service`.
A `vercel.json` is included for routing.

## License

ISC
