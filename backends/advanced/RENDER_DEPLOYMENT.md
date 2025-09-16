# Render Deployment Guide for Friend-Lite Backend

## 🚀 Why Render is Perfect for Friend-Lite

✅ **Free Tier**: 750 hours/month (perfect for development)  
✅ **One-Click Deploy**: Connect GitHub repo and deploy automatically  
✅ **Auto-Deploys**: Every git push triggers new deployment  
✅ **Built-in Database**: PostgreSQL/MongoDB included  
✅ **Simple Pricing**: $7/month for production web service  

## 📋 **Step-by-Step Deployment**

### 1. Push Code to GitHub
```bash
# Make sure your code is in GitHub first
cd /Users/amyzhou/friendlite
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create Render Account
- Go to https://render.com
- Sign up with your GitHub account

### 3. Deploy the Backend

**Option A: Use Blueprint (Recommended)**
1. Go to Render Dashboard
2. Click "Blueprints" → "New Blueprint Instance"
3. Connect your GitHub repo: `amywork777/friendlite`
4. Set root directory: `backends/advanced`
5. Click "Apply"

**Option B: Manual Setup**
1. Click "New" → "Web Service"
2. Connect GitHub repo: `amywork777/friendlite`
3. Configure:
   - **Name**: `friendlite-backend`
   - **Root Directory**: `backends/advanced`
   - **Runtime**: Docker
   - **Dockerfile Path**: `./Dockerfile`
   - **Plan**: Free (or Starter for production)

### 4. Configure Environment Variables

In Render dashboard → Your service → Environment, add:

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

### 5. Add Database

**For MongoDB:**
1. Go to Render Dashboard
2. Click "New" → "PostgreSQL" (free) or use external MongoDB Atlas
3. Connect database URL to your web service:
   ```
   MONGODB_URI=<your-database-url>
   ```

**For Qdrant (Vector Database):**
1. Sign up for Qdrant Cloud (free tier): https://qdrant.tech/
2. Create cluster and get API URL
3. Add to environment variables:
   ```
   QDRANT_BASE_URL=https://your-cluster.qdrant.io
   ```

### 6. Update CORS Origins

After deployment, update this environment variable with your Render URL:
```
CORS_ORIGINS=https://friendlite-backend.onrender.com,http://localhost:5173,http://localhost:3000
```

## 📱 **Update Mobile App**

Change your mobile app's backend URL:

1. Open Friend-Lite app
2. Go to Backend Status 
3. Change from: `ws://localhost:8000/ws_pcm`
4. Change to: `wss://friendlite-backend.onrender.com/ws_pcm`

## ✅ **Testing Your Deployment**

1. **Health Check**: Visit `https://your-app.onrender.com/health`
2. **Web Dashboard**: Visit `https://your-app.onrender.com`  
3. **Login**: Use admin@example.com / admin123
4. **Mobile Test**: Record audio from your phone app
5. **Check Transcriptions**: View in web dashboard or mobile app

## 💰 **Pricing Breakdown**

**Free Tier:**
- ✅ Web Service: 750 hours/month (enough for testing)
- ✅ PostgreSQL: 1GB free
- ❌ Limited: Services sleep after 15min of inactivity

**Production (~$20/month):**
- 💰 Web Service: $7/month (always-on)
- 💰 PostgreSQL: $7/month (shared CPU) or $15/month (dedicated)
- 💰 Qdrant Cloud: $0-25/month depending on usage
- **Total: $14-47/month**

## 🔄 **Auto-Deploy Setup**

Once connected to GitHub:
1. Every `git push` automatically deploys
2. Build logs visible in Render dashboard
3. Rollback to previous versions anytime
4. Zero-downtime deployments

## 🐛 **Troubleshooting**

**Common Issues:**

1. **Build Fails**
   - Check build logs in Render dashboard
   - Verify Dockerfile path is correct
   - Ensure memory_config.yaml exists

2. **Service Won't Start**  
   - Check if port 10000 is correctly configured
   - Verify all environment variables are set
   - Check application logs for errors

3. **Database Connection Issues**
   - Verify MONGODB_URI is correct
   - Check database service is running
   - Test connection from Render shell

4. **API Key Errors**
   - Verify OPENAI_API_KEY and DEEPGRAM_API_KEY
   - Check API key has sufficient credits
   - Test keys locally first

**Debug Commands:**
```bash
# In Render dashboard → Shell
curl localhost:10000/health
env | grep -E "(OPENAI|DEEPGRAM|MONGODB)"
```

## 🔧 **Advanced Features**

**Custom Domain:**
- Add your domain in Render dashboard
- Configure DNS CNAME record
- SSL certificates auto-generated

**Scaling:**
- Upgrade to higher tier for better performance
- Auto-scaling available on higher plans

**Monitoring:**
- Built-in metrics and logs
- Set up alerts for downtime

## 📞 **Support**

- Render Community: https://community.render.com
- Render Docs: https://render.com/docs
- Discord: https://discord.gg/render

## 🎯 **Next Steps After Deployment**

1. Test all features work in production
2. Set up monitoring/alerts  
3. Configure custom domain (optional)
4. Share your deployed URL with others!

Your Friend-Lite backend will be accessible at:
`https://friendlite-backend.onrender.com`