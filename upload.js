import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false, // Отключаем автоматический парсер тела запроса
    },
};

const uploadsDir = path.join(process.cwd(), 'public/uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { createWriteStream } = await import('fs');
        const formidable = await import('formidable');

        const form = new formidable.IncomingForm();
        form.uploadDir = uploadsDir;
        form.keepExtensions = true;

        form.parse(req, (err, fields, files) => {
            if (err) {
                res.status(500).json({ error: 'Ошибка загрузки файла' });
                return;
            }

            const file = files.image;
            const filename = path.basename(file.filepath);
            const fileUrl = `/uploads/${filename}`;

            res.status(200).json({ url: fileUrl });
        });
    } else {
        res.status(405).json({ error: 'Метод не поддерживается' });
    }
}
