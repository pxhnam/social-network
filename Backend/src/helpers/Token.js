import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (token) => {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (error) {
		throw error;
	}
};

export const createToken = (_id) => {
	try {
		if (JWT_SECRET) {
			return jwt.sign({ _id }, JWT_SECRET, { expiresIn: '1h' });
		} else {
			return null;
		}
	} catch (error) {
		console.log(error.message);
		return null;
	}
};
