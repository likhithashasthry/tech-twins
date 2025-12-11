FRONTEND CHANGES REQUIRED
=========================

Place these changes into your React frontend (TypeScript) to connect with the new backend.

1) API_BASE_URL
----------------
Add at top of CreateAccount.tsx, Login.tsx, Dashboard.tsx (or a central api file)
    const API_BASE_URL = 'http://localhost:5000/api';

2) CreateAccount.tsx
--------------------
- On final submit, POST to `${API_BASE_URL}/register` with body:
  { name, email, password, location, flowRate, areaSize }
- On success response, server returns { user: { _id, name, email, plants: [] } }
  call onAccountCreated(savedUser) where savedUser includes _id and plants array.

Example final submit (copy-paste):
```ts
const res = await fetch(`${API_BASE_URL}/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, password, location, flowRate, areaSize })
});
const data = await res.json();
if (!res.ok) throw new Error(data.message || 'Register failed');
onAccountCreated(data.user);
```

3) Login.tsx
------------
- POST to `${API_BASE_URL}/login` with { email, password }
- On success server returns { user: { _id, name, email, plants } }
- Call onLogin(data.user)

4) Adding plants (after signup or from dashboard)
------------------------------------------------
- To add a plant:
  POST `${API_BASE_URL}/users/${user._id}/plants`
  body: { name, soilType, moistureRange, droughtTolerance, cropCoefficient }
- Server returns updated user in data.user

5) Dashboard: watering recommendation
-------------------------------------
- To fetch today's recommendation for user's location (frontend should determine lat/lon):
  GET `${API_BASE_URL}/users/${user._id}/water-recommendation?lat=12.97&lon=77.59`
- Server will call OpenWeatherMap One Call and return:
  { recommendation: 'WATER'|'SKIP', reason, weatherSummary: {...} }
- Display recommendation in dashboard UI (e.g., "Today: SKIP — High chance of rain")

6) OpenWeatherMap API key
-------------------------
- Put your key in backend `.env` as OPENWEATHER_API_KEY
- The backend uses that key to call weather API so frontend doesn't expose the key.

7) Notes about scheduling a daily morning message
-------------------------------------------------
- The backend provides the recommendation endpoint on-demand.
- If you want an automatic daily push (email/push) the backend needs a scheduler (cron or node-cron)
  and an email/sending service (SendGrid) or push notification service.
- For now frontend can call the recommendation endpoint when user opens the dashboard in morning.
