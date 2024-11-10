import User from '../repositories/UserRepository.js';
import Chat from '../repositories/ChatRepository.js';
import TChat from '../constants/TChat.js';
import { createToken } from '../helpers/Token.js';
import response from '../helpers/Response.js';

const UserService = {
	get: async (userCurrentId, username) => {
		try {
			let userCurrent = null;
			if (userCurrentId) {
				userCurrent = await User.getById(userCurrentId);
			}

			const user = await User.getByUsername(username);
			if (user) {
				const userChat = await Chat.findExistingChat(
					[userCurrentId, user._id],
					TChat.PRIVATE
				);
				const userData = {
					first_name: user.first_name,
					last_name: user.last_name,
					avatar: user.avatar,
					username: user.username,
					itsme: user._id.equals(userCurrent && userCurrent._id),
					chatId: userChat?._id,
					followerCount: user.getFollowerCount(),
					followingCount: user.getFollowingCount(),
					isFollowing: userCurrent ? userCurrent.isFollowing(user._id) : false,
				};
				return response.success('', userData);
			} else {
				return response.error('User not found!');
			}
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
			const user = await User.create(
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
			return response.success(user);
		} catch (error) {
			throw error;
		}
	},

	login: async (res, username, password) => {
		try {
			if (!username || !password) {
				return response.error('Please enter all required information.');
			}

			const user = await User.getByUsername(username);
			if (!user) {
				return response.error('User not found or username is incorrect.');
			}

			const isPasswordValid = await user.comparePassword(password);

			if (!isPasswordValid) {
				return response.error('Username or password is incorrect.');
			}

			if (!user.status) {
				return response.error('Your account has been temporarily locked.');
			}

			const token = createToken(user._id);
			if (token) {
				res.cookie('token', token, {
					maxAge: 3600000,
				});
				return response.success('Login successful!', {
					avatar: user.avatar,
					username: user.username,
					name: user.first_name + ' ' + user.last_name,
				});
			} else {
				return response.error(
					'Failed to generate authentication token. Please try again later.'
				);
			}
		} catch (error) {
			throw error;
		}
	},

	register: async (first_name, last_name, username, password) => {
		try {
			if (!first_name || !last_name || !username || !password) {
				return response.error('Please enter all required information.');
			}

			const user = await User.getByUsername(username);
			if (user) {
				return response.error('Username already exists.');
			} else {
				const newUser = await User.create(
					first_name,
					last_name,
					username,
					password,
					'http://127.0.0.1:3000/uploads/default-avatar.png',
					true,
					false
				);
				if (newUser) {
					return response.success('Login now!');
				}
			}
		} catch (error) {
			throw error;
		}
	},
	profile: async (id) => {
		try {
			const user = await User.getById(id);
			if (user) {
				return response.success('', {
					avatar: user.avatar,
					username: user.username,
					name: user.first_name + ' ' + user.last_name,
				});
			} else {
				return response.error('User not found');
			}
		} catch (error) {
			throw error;
		}
	},
	follow: async (userCurrentId, username) => {
		try {
			if (!username) {
				return response.error('Username is required.');
			}

			const userCurrent = await User.getById(userCurrentId);
			const otherUser = await User.getByUsername(username);

			if (!userCurrent || !otherUser) {
				return response.error('User not found!');
			}

			if (userCurrent._id.toString() === otherUser._id.toString()) {
				return response.error('You cannot follow yourself.');
			}

			await userCurrent.follow(otherUser._id);
			return response.success('Followed successfully!');
		} catch (error) {
			throw error;
		}
	},
	unfollow: async (userCurrentId, username) => {
		try {
			if (!username) {
				return response.error('User not found!');
			}

			const userCurrent = await User.getById(userCurrentId);
			const otherUser = await User.getByUsername(username);

			if (!userCurrent || !otherUser) {
				return response.error('User not found!');
			}

			await userCurrent.unfollow(otherUser._id);
			return response.success('Unfollowed successfully!');
		} catch (error) {
			throw error;
		}
	},
};

export default UserService;
