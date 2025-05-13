# Vibego Backend

This repository contains the backend server for the Vibego mobile application. The backend is built using Node.js and Express, and it integrates with the Google Places API to return location-based recommendations based on user preferences such as mood, time availability, budget, and travel distance.

---

## Features

- REST API for place recommendations
- Integration with Google Places API
- Dynamic filtering based on:
  - Mood
  - Time duration
  - Budget
  - Travel distance
- API key and secrets managed via environment variables
- Dockerfile included for containerized deployment
- Ready for deployment on Google Cloud Run

---

## Project Structure

```
vibego-backend/
│
├── routes/
│   └── places.js              # Route handling Google Places requests
├── server.js                  # Express server setup
├── Dockerfile                 # Docker config for deployment
├── .env                       # Environment variables (not committed)
├── .gitignore                 # Git ignore file
├── package.json               # Node dependencies and scripts
├── package-lock.json          # Dependency lock file
└── README.md                  # Project documentation
```

---

## Prerequisites

- Node.js (v16 or later recommended)
- A Google Cloud project with the Places API enabled
- Google Cloud CLI (for deployment)
- Docker (optional for local container testing)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/vibego-backend.git
cd vibego-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```bash
touch .env
```

Inside `.env`, add the following:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

Do not commit this file to source control.

### 4. Start the server locally

```bash
node server.js
```

The API will be available at: `http://localhost:3000/api/places`

---

## API Usage

### Endpoint

```
GET /api/places
```

### Query Parameters

| Parameter    | Type    | Required | Description                               |
|--------------|---------|----------|-------------------------------------------|
| `lat`        | float   | yes      | Latitude of the user                      |
| `lng`        | float   | yes      | Longitude of the user                     |
| `radius`     | integer | yes      | Radius in meters (e.g., 2000 for 2km)     |
| `type`       | string  | optional | Place type (e.g., restaurant, museum)     |
| `keyword`    | string  | optional | Keyword to refine search results          |
| `price_level`| integer | optional | 0 (free) to 4 (most expensive)            |

### Example

```
GET /api/places?lat=-33.8675&lng=151.2070&radius=2000&type=restaurant
```

---

## Docker Support

### Build and run locally with Docker

```bash
docker build -t vibego-backend .
docker run -p 3000:3000 --env-file .env vibego-backend
```

---

## Deploy to Google Cloud Run

1. Enable Cloud Build and Cloud Run APIs on your GCP project.
2. Authenticate using:

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

3. Build and deploy:

```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/vibego-backend
gcloud run deploy vibego-backend \
  --image gcr.io/YOUR_PROJECT_ID/vibego-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## Copyright

© 2025 Nimish Singh. All rights reserved.
