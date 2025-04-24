const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const uploadsDir = path.join(__dirname, '../uploads');
const fs = require('fs');


// Définir l'emplacement de sauvegarde des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Répertoire où les fichiers seront stockés
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Ajoute un timestamp pour chaque fichier pour éviter les conflits
  }
});

const upload = multer({ storage: storage });

// Route pour télécharger un fichier
router.post('/upload', upload.array('files'), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ message: 'Aucun fichier n\'a été téléchargé' });
    }

    const fileInfos = req.files.map(file => ({
      filename: file.filename,
      path: `/uploads/${file.filename}`
    }));

    res.status(200).send({
      message: 'Fichiers téléchargés avec succès',
      files: fileInfos
    });
  } catch (err) {
    console.error('Erreur lors de l\'upload:', err);
    res.status(500).send({ message: 'Erreur serveur lors de l\'upload' });
  }
});



router.get('/', (req, res) => {
    fs.readdir(uploadsDir, (err, files) => {
      if (err) {
        return res.status(500).json({ error: 'Impossible de lire le dossier' });
      }
      // Retourne une liste d'URL accessibles
      const fileUrls = files.map(filename => `http://localhost:3000/uploads/${filename}`);
      res.json({ files: fileUrls });
    });
  });

module.exports = router;
