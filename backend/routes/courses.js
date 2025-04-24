const express = require('express');
const router = express.Router();
const { readExcelFile, writeExcelFile } = require('../utils/excelManager');;
const path = require('path');
const XLSX = require('xlsx');
const filePath = path.join(__dirname, '..', 'courses.xlsx');

function writeCoursesToExcel(data, path = filePath) {
  // Ne garder que les champs nécessaires
  const cleanedData = data.map(course => ({
    id: course.id,
    item: course.item,
    quantity: course.quantity
  }));

  const worksheet = XLSX.utils.json_to_sheet(cleanedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Courses');
  XLSX.writeFile(workbook, path);
}

// Récupérer la liste
router.get('/', async (req, res) => {
  const data = await readExcelFile(filePath);
  res.json({ courses: data });
});

// Ajouter un produit
router.post('/', async (req, res) => {
  try {
    const courses = await readExcelFile(filePath);
    const newItem = req.body;
    courses.push(newItem);
    await writeCoursesToExcel(courses);
    res.status(201).json(newItem);
  } catch (err) {
    console.error('❌ Erreur ajout course:', err);
    res.status(500).json({ error: 'Erreur ajout course' });
  }
});

// Modifier un produit
router.put('/:id', async (req, res) => {
  const courses = await readExcelFile(filePath);
  const index = courses.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    courses[index] = { ...courses[index], ...req.body };
    await writeExcelFile(filePath, courses);
    res.json(courses[index]);
  } else {
    res.status(404).json({ error: 'Produit non trouvé' });
  }
});

// Supprimer un produit
router.delete('/:id', async (req, res) => {
  const productID = Number(req.params.id);
  console.log("🔍 Suppression du produit avec l'id :", productID);
  let courses = await readExcelFile(filePath);
  courses = courses.filter(c => c.id !== productID);
  console.log("🔍 courses:", courses);
  await writeExcelFile(filePath, courses);
  res.status(204).send();
});


module.exports = router;
