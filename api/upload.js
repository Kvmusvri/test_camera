// api/upload.js
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

export const config = {
  api: {
    bodyParser: false, // Отключаем парсинг тела запроса, чтобы использовать formidable
  },
};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(process.cwd(), '/uploads');
    form.keepExtensions = true;

    // Создаем папку для хранения файлов, если её нет
    if (!fs.existsSync(form.uploadDir)) {
      fs.mkdirSync(form.uploadDir);
    }

    form.parse(req, (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: 'Ошибка загрузки файла' });
        return;
      }

      // Возвращаем путь к файлу
      res.status(200).json({ fileUrl: `/uploads/${files.file[0].newFilename}` });
    });
  } else {
    res.status(405).json({ error: 'Метод не поддерживается' });
  }
}
