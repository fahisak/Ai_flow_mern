# MERN AI Flow App

## Description

A MERN stack application that uses React Flow to connect a prompt node with an AI-generated response using OpenRouter API.

## Tech Stack

- MongoDB
- Express.js
- React
- Node.js
- React Flow
- OpenRouter AI

## Features

- Input prompt node
- AI response node
- Run Flow button
- Save prompt & response to MongoDB

### AI Model Note

This project uses the free OpenRouter model
`mistralai/mistral-7b-instruct:free` as specified in the assignment.

Free OpenRouter models may occasionally be rate-limited or temporarily unavailable.
The backend handles this gracefully by returning a user-friendly message.

## Setup Instructions

### Backend

```bash
cd backend
npm install
node server.js

### Create .env file
MONGO_URI=your_mongodb_uri
OPENROUTER_API_KEY=your_api_key

```

### Frontend

```bash
cd frontend
npm install
npm start




```
