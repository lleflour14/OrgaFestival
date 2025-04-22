const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const XLSX = require('xlsx');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const EXCEL_FILE = path.join(__dirname, 'users.xlsx');
const SHEET_NAME = 'Users';

// Lire les utilisateurs
function readUsersFromExcel() {
  if (!fs.existsSync(EXCEL_FILE)) return [];
  const workbook = XLSX.readFile(EXCEL_FILE);
  const sheet = workbook.Sheets[SHEET_NAME];
  const users = XLSX.utils.sheet_to_json(sheet);
  // Convertir les champs JSON stringifiés en vrais objets
  return users.map(user => ({
    ...user,
    isVolunteer: user.isVolunteer === 'true' || user.isVolunteer === true,
    presenceDays: user.presenceDays ? JSON.parse(user.presenceDays) : [],
    gear: user.gear ? JSON.parse(user.gear) : [],
    refundBalance: parseFloat(user.refundBalance) || 0
  }));
}

// Écrire les utilisateurs
function writeUsersToExcel(users) {
  // Stringifier les champs complexes
  const data = users.map(user => ({
    ...user,
    presenceDays: JSON.stringify(user.presenceDays),
    gear: JSON.stringify(user.gear),
    isVolunteer: String(user.isVolunteer),
    refundBalance: user.refundBalance
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, SHEET_NAME);
  XLSX.writeFile(workbook, EXCEL_FILE);
}

// GET tous les utilisateurs
app.get('/api/users', (req, res) => {
  const users = readUsersFromExcel();
  res.json(users);
});

// GET un utilisateur
app.get('/api/users/:id', (req, res) => {
  const users = readUsersFromExcel();
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (user) res.json(user);
  else res.status(404).json({ message: 'Utilisateur non trouvé' });
});

// POST créer un utilisateur
app.post('/api/users', (req, res) => {
  const users = readUsersFromExcel();
  const newUser = {
    id: Date.now(),
    surname: req.body.surname || '',
    isVolunteer: !!req.body.isVolunteer,
    presenceDays: req.body.presenceDays || [],
    gear: req.body.gear || [],
    refundBalance: req.body.refundBalance || 0
  };
  users.push(newUser);
  writeUsersToExcel(users);
  res.status(201).json(newUser);
});

// PUT mise à jour
app.put('/api/users/:id', (req, res) => {
  let users = readUsersFromExcel();
  const userId = parseInt(req.params.id);
  let updatedUser = null;

  users = users.map(user => {
    if (user.id === userId) {
      updatedUser = {
        ...user,
        ...req.body,
        presenceDays: req.body.presenceDays || [],
        gear: req.body.gear || [],
        refundBalance: req.body.refundBalance || 0,
        isVolunteer: !!req.body.isVolunteer
      };
      return updatedUser;
    }
    return user;
  });

  if (updatedUser) {
    writeUsersToExcel(users);
    res.status(200).json(updatedUser);
  } else {
    res.status(404).json({ message: 'Utilisateur non trouvé' });
  }
});

// DELETE utilisateur
app.delete('/api/users/:id', (req, res) => {
  let users = readUsersFromExcel();
  const userId = parseInt(req.params.id);
  users = users.filter(u => u.id !== userId);
  writeUsersToExcel(users);
  res.status(204).send();
});

// 🎒 Liste d'affaires générale
const affaires = [];

app.post('/api/affaires', (req, res) => {
  const { name, objet } = req.body;
  affaires.push({ name, objet });
  res.json({ message: `${name} amène ${objet}` });
});

app.get('/api/affaires', (req, res) => {
  res.json(affaires);
});

// Courses
app.get('/api/courses', (req, res) => {
  res.json({ courses: ['Tentes', 'Boissons', 'Matelas'] });
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`✅ Backend running on http://localhost:${port}`);
});
