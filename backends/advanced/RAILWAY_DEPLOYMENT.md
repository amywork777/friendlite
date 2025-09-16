# Railway Deployment Guide for Friend-Lite Backend

## 🚀 Quick Deployment Steps

### 1. Login to Railway
```bash
railway login
```

### 2. Initialize Project
```bash
cd /Users/amyzhou/friendlite/backends/advanced
railway init
```

### 3. Add Databases
```bash
# Add MongoDB
railway add -d mongodb

# Add Qdrant (vector database) - use Docker service
railway add
# Select "Empty Service" and name it "qdrant"
```

### 4. Configure Environment Variables

In Railway dashboard, add these environment variables:

**Required Variables:**
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
BACKEND_PUBLIC_PORT=${{RAILWAY_STATIC_URL}}
WEBUI_PORT=5173

LANGFUSE_ENABLE_TELEMETRY=False
```

**Auto-configured by Railway:**
- `PORT` (automatic)
- `RAILWAY_STATIC_URL` (automatic)
- `MONGO_URL` (from MongoDB service)

### 5. Configure Qdrant Service

For the Qdrant service, set these variables:
```
QDRANT_IMAGE=qdrant/qdrant:latest
QDRANT_CONFIG={}
```

### 6. Deploy
```bash
railway up
```

### 7. Update CORS Origins

After deployment, update the CORS_ORIGINS variable with your actual Railway URL:
```
CORS_ORIGINS=https://your-app-name.railway.app,http://localhost:5173,http://localhost:3000
```

## 📱 Update Mobile App

Update your mobile app's backend URL to point to Railway:

1. Open the Friend-Lite app
2. Go to Backend Status section
3. Change URL from `ws://localhost:8000/ws` to `wss://your-app-name.railway.app/ws_pcm`

## 🔍 Verification Steps

1. **Check deployment:** Visit `https://your-app-name.railway.app/health`
2. **Test authentication:** Login at `https://your-app-name.railway.app`
3. **Test mobile connection:** Record audio from the app
4. **Check conversations:** View transcriptions in web dashboard

## 💰 Railway Pricing

**Starter Plan (Free):**
- $5 free credits monthly
- Perfect for development and testing

**Pro Plan ($20/month):**
- Unlimited usage
- Better performance for production

**Estimated monthly cost with usage:**
- Backend hosting: ~$10-15
- MongoDB: ~$5-10  
- Qdrant: ~$5-10
- **Total: ~$20-35/month**

## 🐛 Troubleshooting

**Common Issues:**

1. **Build fails:** Check that all files are committed to git
2. **Database connection fails:** Ensure MONGO_URL is set correctly
3. **API calls fail:** Verify your API keys are correct
4. **CORS errors:** Update CORS_ORIGINS with your Railway URL

**Logs:**
```bash
railway logs
```

**Environment check:**
```bash
railway variables
```

## 🔧 Advanced Configuration

### Custom Domain
```bash
railway domain add your-domain.com
```

### Scaling
Railway automatically scales based on traffic.

### Monitoring  
Built-in metrics available in Railway dashboard.

## 📞 Support

- Railway Discord: https://discord.gg/railway
- Railway Docs: https://docs.railway.app