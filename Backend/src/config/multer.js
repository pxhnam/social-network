import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'src/public/uploads/');
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + ext);
	},
});

export default multer({ storage: storage });
