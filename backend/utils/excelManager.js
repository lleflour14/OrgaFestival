const fs = require('fs');
const XLSX = require('xlsx');

function safeParse(value, fallback) {
  try {
    return JSON.parse(value || '');
  } catch (e) {
    return fallback;
  }
}

function readExcelFile(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });
  return Promise.resolve(data.map(row => ({
    ...row,
    gear: JSON.parse(row.gear || '[]'),
    presenceDays: row.presenceDays ? JSON.parse(row.presenceDays) : [],
    transactions: safeParse(row.transactions, [])
  })));
}

function writeExcelFile(filePath, data) {
  const newData = data.map(user => ({
    ...user,
    gear: JSON.stringify(user.gear),
    presenceDays: JSON.stringify(user.presenceDays),
    transactions: JSON.stringify(user.transactions || [])
  }));

  const ws = XLSX.utils.json_to_sheet(newData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Utilisateurs');
  XLSX.writeFile(wb, filePath);
  return Promise.resolve();
}

module.exports = { readExcelFile, writeExcelFile };
