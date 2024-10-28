import { verifyToken } from '../helpers/Token.js';
import User from '../repositories/UserRepository.js';

export const Authenticate = async (request, response, next) => {
	const { token } = request.cookies;

	if (!token) {
		return response.status(401).json({ message: 'Please log in to continue.' });
	}

	try {
		const { _id } = verifyToken(token);
		const user = await User.getById(_id);
		if (user && user.status) {
			request.currentUserId = _id;
			next();
		} else {
			response.clearCookie('token');
			return response
				.status(404)
				.json({ message: 'User not found or account is inactive.' });
		}
	} catch (error) {
		console.log(error.message);
		return response.status(401).json({ message: 'Invalid or expired token.' });
	}
};

export const Authorize = async (request, response, next) => {
	const token = request.cookies.token;
	if (!token) {
		return response.status(401).json({ message: 'Please log in to continue.' });
	}

	// try {
	//   const data = verifyToken(token);
	//   const user = await User.findOne({ _id: data._id });
	//   if (!user) {
	//     return res.redirect('/login');
	//   }
	//   if (!user.role) {
	//     return res.redirect('/');
	//   }
	//   next();
	// } catch (error) {
	//   res.clearCookie('token');
	//   return res.redirect('/login');
	// }
};

// exports = {
// 	Authenticate,
// 	Authorize,
// };
