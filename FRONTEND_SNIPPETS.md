Snippets to paste into your frontend components:

1) Login.tsx submit -> call backend
-----------------------------------
```ts
const submit = async (e) => {
  e.preventDefault();
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) { setError(data.message); return; }
  onLogin(data.user);
};
```

2) Dashboard fetch recommendation
----------------------------------
```ts
useEffect(()=> {
  if (!user?._id) return;
  // get lat/lon from user's saved location or browser geolocation
  const lat = 12.97, lon = 77.59;
  fetch(`${API_BASE_URL}/users/${user._id}/water-recommendation?lat=${lat}&lon=${lon}`)
    .then(r=>r.json()).then(d=>{
      if (d.recommendation) setRecommendation(d);
    }).catch(err => console.error(err));
}, [user]);
``` 
