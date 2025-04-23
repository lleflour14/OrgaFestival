const express = require('express');
const router = express.Router();
const fs = require('fs');
const XLSX = require('xlsx');

const filePath = './data/courses.xlsx';

router.get('/', (req, res) => {
  try {
    if (!fs.existsSync(filePath)) {
      return res.json([]); // si le fichier n'existe pas encore
    }

    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erreur de lecture des courses' });
  }
});

router.post('/', (req, res) => {
  try {
    const newItem = req.body;

    let data = [];
    if (fs.existsSync(filePath)) {
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      data = XLSX.utils.sheet_to_json(sheet);
    }

    data.push(newItem);

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Courses');
    XLSX.writeFile(wb, filePath);

    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: 'Erreur d\'écriture des courses' });
  }
});

module.exports = router;
