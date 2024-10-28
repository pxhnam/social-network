import { verifyToken } from '../helpers/Token.js';

const AttachMiddleware = async (request, response, next) => {
	const { token } = request.cookies;
	let currentUserId = null;
	if (token) {
		try {
			const { _id } = verifyToken(token);
			currentUserId = _id;
		} catch (error) {
			console.log(error.message);
		}
	}
	request.currentUserId = currentUserId;
	next();
};
export default AttachMiddleware;
