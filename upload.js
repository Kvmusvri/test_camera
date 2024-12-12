import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false,  // Отключаем автоматический парсер тела запроса
    },
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { IncomingForm } = await import('formidable');

        const form = new IncomingForm();
        const tempDir = path.join('/tmp', 'uploads');

        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        form.uploadDir = tempDir;
        form.keepExtensions = true;

        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка обработки файла' });
            }

            const file = files.image;
            const filename = path.basename(file.filepath);
            const fileUrl = `/uploads/${filename}`;

            // Перемещаем файл в директорию public, чтобы он стал доступен
            const publicPath = path.join(process.cwd(), 'public', 'uploads', filename);

            fs.rename(file.filepath, publicPath, (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Ошибка сохранения файла на сервере' });
                }

                res.status(200).json({ url: fileUrl });
            });
        });
    } else {
        res.status(405).json({ error: 'Метод не поддерживается' });
    }
}
