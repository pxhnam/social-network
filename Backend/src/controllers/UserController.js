import User from '../services/UserService.js';

// await new Promise((resolve) => setTimeout(resolve, 5000));

class UserController {
	Get = async (req, res) => {
		try {
			const { username } = req.params;
			const currentUserId = req.currentUserId;
			const result = await User.get(currentUserId, username);
			return res.json(result);
		} catch (error) {
			console.log(error.message);
			return res
				.status(500)
				.json({ message: 'Something went wrong, please try again later' });
		}
	};

	Login = async (req, res) => {
		try {
			const { username, password } = req.body;
			const result = await User.login(res, username, password);
			return res.json(result);
		} catch (error) {
			console.log(error.message);
			return res
				.status(500)
				.json({ message: 'Something went wrong, please try again later' });
		}
	};

	Register = async (req, res) => {
		const { first_name, last_name, username, password } = req.body;
		try {
			const result = await User.register(
				first_name,
				last_name,
				username,
				password
			);
			return res.json(result);
		} catch (error) {
			console.log(error.message);
			return res
				.status(500)
				.json({ message: 'Something went wrong, please try again later' });
		}
	};

	Follow = async (req, res) => {
		try {
			const { username } = req.body;
			const id = req.currentUserId;
			const result = await User.follow(id, username);
			return res.json(result);
		} catch (error) {
			console.log(error.message);
			return res
				.status(500)
				.json({ message: 'Something went wrong, please try again later' });
		}
	};

	UnFollow = async (req, res) => {
		try {
			const { username } = req.body;
			const id = req.currentUserId;
			const result = await User.unfollow(id, username);
			return res.json(result);
		} catch (error) {
			console.log(error.message);
			return res
				.status(500)
				.json({ message: 'Something went wrong, please try again later' });
		}
	};

	Profile = async (req, res) => {
		try {
			const id = req.currentUserId;
			const result = await User.profile(id);
			return res.json(result);
		} catch (error) {
			console.log(error.message);
			return res
				.status(500)
				.json({ message: 'Something went wrong, please try again later' });
		}
	};

	Create = async (req, res) => {
		try {
			const {
				first_name,
				last_name,
				username,
				password,
				avatar,
				cover,
				profile,
				verify,
				status,
				role,
			} = req.body;
			const result = await User.create(
				first_name,
				last_name,
				username,
				password,
				avatar,
				cover,
				profile,
				verify,
				status,
				role
			);
			return res.status(201).json(result);
		} catch (error) {
			console.log(error.message);
			return res
				.status(500)
				.json({ message: 'Something went wrong, please try again later' });
		}
	};

	Logout = async (req, res) => {
		try {
			res.clearCookie('token');
			return res
				.status(200)
				.json({ status: true, message: 'Logout successful!' });
		} catch (error) {
			console.log(error.message);
			return res
				.status(500)
				.json({ message: 'Something went wrong, please try again later' });
		}
	};
}

export default new UserController();
