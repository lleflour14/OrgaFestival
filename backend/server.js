const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const usersRoutes = require('./routes/users');
const transactionsRoutes = require('./routes/transactions');
const affairesRoutes = require('./routes/affaires');
const coursesRoutes = require('./routes/courses');
const albumRoutes = require("./routes/album")
const allTransactionsRoutes = require('./routes/allTransactions');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/users', usersRoutes);             // /api/users/
//app.use('/api/users', transactionsRoutes);      // /api/users/:id/transactions
app.use('/api/affaires', affairesRoutes);          // /api/affaires
app.use('/api/courses', coursesRoutes);         // /api/courses/
app.use('/api/album',albumRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(port, () => {
  console.log(`🎧 Serveur lancé sur http://localhost:${port}`);
});
