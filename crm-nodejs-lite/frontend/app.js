async function getHealth() {
  const res = await fetch('/api/health');
  document.getElementById('health').textContent = await res.text();
}

document.getElementById('login').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const body = { username: form.username.value, password: form.password.value };
  const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(body) });
  const data = await res.json();
  alert(JSON.stringify(data));
  if (res.ok) {
    const cust = await fetch('/api/customers');
    document.getElementById('customers').textContent = JSON.stringify(await cust.json(), null, 2);
  }
});

getHealth();
