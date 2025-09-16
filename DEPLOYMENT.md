# 🚀 Friend-Lite Render Deployment Guide

## Quick Deploy Steps

### 1. Go to Render
- Visit https://render.com
- Sign up with GitHub account
- Click "New Web Service"

### 2. Connect Repository
- Select `amywork777/friendlite`
- **Leave root directory EMPTY** (use the root directory)
- Runtime: Docker
- Build Command: (leave empty)
- Start Command: (leave empty)

### 3. Add Environment Variables

Click "Environment" and add:

```
AUTH_SECRET_KEY=your-super-secret-jwt-key-change-this-to-something-random-and-long-123456
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@example.com

OPENAI_API_KEY=your-openai-api-key-here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini

DEEPGRAM_API_KEY=your-deepgram-api-key-here
TRANSCRIPTION_PROVIDER=deepgram

LLM_PROVIDER=openai
MEMORY_PROVIDER=friend_lite

HOST=0.0.0.0
PORT=10000
BACKEND_PUBLIC_PORT=10000
WEBUI_PORT=5173

LANGFUSE_ENABLE_TELEMETRY=False
```

### 4. Add Database
- In Render dashboard, click "New" → "PostgreSQL"
- Choose free tier
- Once created, connect it to your web service
- Add the database URL as: `MONGODB_URI=<your-postgres-url>`

### 5. Deploy
- Click "Create Web Service"
- Wait for deployment (5-10 minutes)
- Your app will be at: `https://your-app-name.onrender.com`

### 6. Update Mobile App
Change backend URL in your mobile app:
- From: `ws://localhost:8000/ws_pcm`  
- To: `wss://your-app-name.onrender.com/ws_pcm`

## Testing Deployment

1. Visit `https://your-app-name.onrender.com/health`
2. Should see `{"status":"healthy"}`
3. Login at `https://your-app-name.onrender.com` with admin@example.com / admin123
4. Test mobile app audio recording

## Pricing
- **Free**: 750 hours/month
- **Starter**: $7/month (always-on)
- **Database**: $7/month (PostgreSQL)

**Total**: Free for testing, ~$14/month for production

## Support
If you get stuck, check the build logs in Render dashboard for errors!