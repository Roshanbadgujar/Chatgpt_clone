# Backend Quick Check Guide

Agar aapko dekhna hai ki backend mein kya bana hai, yeh steps follow karo:

## 1) Server run karo

```bash
cd backend
npm install
npm start
```

> Required env keys (minimum):
> - `PORT`
> - `MONGODB_URI`
> - `JWT_SECRET`
> - `GOOGLE_API_KEY`
> - `FRONTEND_ORIGIN` (optional, default: `http://localhost:5173`)

---

## 2) Health endpoint check

```bash
curl http://localhost:3000/api/health
```

Aapko JSON response milega with available socket events and routes.

---

## 3) Third-party integration route check

```bash
curl -H "Authorization: Bearer <JWT_TOKEN>" \
  http://localhost:3000/api/integrations/companion-spark
```

Response mein `advice`, `quote`, `activity` aayega.

---

## 4) Socket.IO events ka flow

Client connect ke baad yeh events available hain:

- `ai-message` (send user message, get AI reply)
- `join-chat` (room join)
- `leave-chat` (room leave)
- `typing` (typing indicator)
- `fetch-companion-spark` (emit karke `companion-spark` receive)
- `ai-error` (error handling)

### Example socket payload for AI

```json
{
  "chatId": "<optional_chat_id>",
  "message": "Tum kaise ho?",
  "meta": {
    "voiceMode": false,
    "isPremium": true,
    "memoryHints": ["User likes short shayari"]
  }
}
```

---

## 5) Frontend se kaise verify karein

- Chat page open karo
- New chat start karo
- Ek message bhejo
- Network tab mein `socket` frames check karo
- `ai-message` response + optional `title` verify karo

