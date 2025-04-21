const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Endpoints basiques pour gérer les données
app.get('/api/courses', (req, res) => {
  res.json({ courses: ['Tentes', 'Boissons', 'Matelas'] });
});

app.post('/api/presence', (req, res) => {
  const { name, date } = req.body;
  res.json({ message: `Présence de ${name} confirmée pour le ${date}` });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
