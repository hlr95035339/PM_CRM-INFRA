const loginSection = document.getElementById('loginSection');
const crmApp = document.getElementById('crmApp');
const customersList = document.getElementById('customersList');
const customersTable = document.getElementById('customersTable');
const ordersTable = document.getElementById('ordersTable');
const ticketsTable = document.getElementById('ticketsTable');
const messageBox = document.getElementById('message');

const customerCountEl = document.getElementById('customerCount');
const ticketCountEl = document.getElementById('ticketCount');
const orderCountEl = document.getElementById('orderCount');

function getToken() {
  return localStorage.getItem('crmToken');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

function showMessage(text) {
  if (messageBox) {
    messageBox.textContent = text;
  }
}

function renderCustomerSummary(customers) {
  customerCountEl.textContent = String(customers.length);

  if (!customersList) return;
  if (!Array.isArray(customers) || customers.length === 0) {
    customersList.innerHTML = '<p>No customers found.</p>';
    return;
  }

  const list = document.createElement('ul');
  customers.forEach((customer) => {
    const item = document.createElement('li');
    item.innerHTML = `<strong>${customer.name}</strong> — ${customer.email}`;
    list.appendChild(item);
  });

  customersList.innerHTML = '';
  customersList.appendChild(list);
}

function renderCustomerTable(customers) {
  if (!customersTable) return;

  if (!Array.isArray(customers) || customers.length === 0) {
    customersTable.innerHTML = '<p>No customer records available.</p>';
    return;
  }

  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
      </tr>
    </thead>
  `;

  const tbody = document.createElement('tbody');
  customers.forEach((customer) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${customer.id}</td>
      <td>${customer.name}</td>
      <td>${customer.email}</td>
    `;
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  customersTable.innerHTML = '';
  customersTable.appendChild(table);
}

function renderOrderTable(orders) {
  if (!ordersTable) return;

  if (!Array.isArray(orders) || orders.length === 0) {
    ordersTable.innerHTML = '<p>No orders available.</p>';
    orderCountEl.textContent = '0';
    return;
  }

  orderCountEl.textContent = String(orders.length);

  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Customer ID</th>
        <th>Total</th>
        <th>Status</th>
      </tr>
    </thead>
  `;

  const tbody = document.createElement('tbody');
  orders.forEach((order) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.customerId ?? order.customer_id ?? '-'}</td>
      <td>${order.total ?? '-'}</td>
      <td><span class="status-pill">${order.status ?? 'pending'}</span></td>
    `;
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  ordersTable.innerHTML = '';
  ordersTable.appendChild(table);
}

function renderTicketTable(tickets) {
  if (!ticketsTable) return;

  if (!Array.isArray(tickets) || tickets.length === 0) {
    ticketsTable.innerHTML = '<p>No tickets available.</p>';
    ticketCountEl.textContent = '0';
    return;
  }

  const openTickets = tickets.filter((ticket) => ticket.status?.toLowerCase() === 'open').length;
  ticketCountEl.textContent = String(openTickets);

  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Status</th>
      </tr>
    </thead>
  `;

  const tbody = document.createElement('tbody');
  tickets.forEach((ticket) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${ticket.id}</td>
      <td>${ticket.title}</td>
      <td><span class="status-pill">${ticket.status}</span></td>
    `;
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  ticketsTable.innerHTML = '';
  ticketsTable.appendChild(table);
}

async function loadDashboard() {
  try {
    const customerResponse = await fetch('http://localhost:3000/api/customers', { headers: authHeaders() });
    const customers = await customerResponse.json();
    renderCustomerSummary(customers);
    renderCustomerTable(customers);

    const orderResponse = await fetch('http://localhost:3000/api/orders', { headers: authHeaders() });
    const orders = await orderResponse.json();
    renderOrderTable(orders);

    const ticketResponse = await fetch('http://localhost:3000/api/tickets', { headers: authHeaders() });
    const tickets = await ticketResponse.json();
    renderTicketTable(tickets);
  } catch (error) {
    showMessage('Unable to load CRM dashboard data.');
  }
}

async function login(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const payload = {
    username: form.username.value,
    password: form.password.value,
  };

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok || !data.token) {
      showMessage(data.message || 'Login failed');
      return;
    }

    localStorage.setItem('crmToken', data.token);
    loginSection.classList.add('hidden');
    crmApp.classList.remove('hidden');
    showMessage(`Welcome ${data.user.username}`);
    loadDashboard();
  } catch (error) {
    showMessage('Login failed.');
  }
}

async function addCustomer(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const payload = {
    name: form.name.value,
    email: form.email.value,
  };

  try {
    const response = await fetch('http://localhost:3000/api/customers', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    showMessage(data.message || 'Customer added');
    form.reset();
    loadDashboard();
  } catch (error) {
    showMessage('Failed to add customer.');
  }
}

async function createOrder(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const payload = {
    customerId: Number(form.customerId.value),
    total: Number(form.total.value),
    status: form.status.value,
  };

  try {
    const response = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    showMessage(data.message || 'Order created');
    form.reset();
    loadDashboard();
  } catch (error) {
    showMessage('Failed to create order.');
  }
}

async function submitTicket(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const payload = {
    customerId: Number(form.customerId.value),
    title: form.title.value,
    status: form.status.value,
  };

  try {
    const response = await fetch('http://localhost:3000/api/tickets', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    showMessage(data.message || 'Ticket submitted');
    form.reset();
    loadDashboard();
  } catch (error) {
    showMessage('Failed to submit ticket.');
  }
}

document.getElementById('loginForm')?.addEventListener('submit', login);
document.getElementById('customerForm')?.addEventListener('submit', addCustomer);
document.getElementById('orderForm')?.addEventListener('submit', createOrder);
document.getElementById('ticketForm')?.addEventListener('submit', submitTicket);

if (getToken()) {
  loginSection.classList.add('hidden');
  crmApp.classList.remove('hidden');
  loadDashboard();
}
