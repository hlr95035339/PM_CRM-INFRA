require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { verifyToken } = require('./utils/auth');
const { initDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

initDatabase();

const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');
const orderRoutes = require('./routes/orders');
const ticketRoutes = require('./routes/tickets');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CRM backend is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes); // public customer list
app.use(verifyToken);
app.use('/api/orders', orderRoutes);
app.use('/api/tickets', ticketRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong'
  });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`CRM backend running on port ${PORT}`));
}

module.exports = app;
