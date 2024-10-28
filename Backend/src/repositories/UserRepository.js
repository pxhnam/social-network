import bcrypt from 'bcrypt';
import User from '../models/User.js';

const UserRepository = {
	get: async () => {
		try {
			const users = await User.find();
			return users;
		} catch (error) {
			throw error;
		}
	},

	getById: async (id) => {
		try {
			const user = await User.findById(id);
			return user;
		} catch (error) {
			throw error;
		}
	},

	getByUsername: async (username) => {
		try {
			const user = await User.findOne({ username });

			if (!user) {
				return null;
			}

			return user;
		} catch (error) {
			throw error;
		}
	},

	create: async (
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
	) => {
		try {
			// password = await bcrypt.hash(password, 10);
			const user = new User({
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
			});
			await user.save();
			return user;
		} catch (error) {
			throw error;
		}
	},

	edit: async (id, data) => {
		try {
			if (data.password) {
				data.password = await bcrypt.hash(data.password, 10);
			}
			const user = await User.findByIdAndUpdate(id, data, { new: true });
			return user;
		} catch (error) {
			throw error;
		}
	},
};

export default UserRepository;
