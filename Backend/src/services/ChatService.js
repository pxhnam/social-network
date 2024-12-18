import Chat from '../repositories/ChatRepository.js';
import User from '../repositories/UserRepository.js';
import Message from '../repositories/MessageRepository.js';
import TChat from '../constants/TChat.js';
import response from '../helpers/Response.js';

const ChatService = {
	get: async (userId) => {
		try {
			const chats = await Chat.getByUserId(userId);
			const results = [];
			for (const chat of chats) {
				const lastMessage = await Message.getLatestByChatId(chat._id);
				let user = null;
				let avatar, name, username;
				if (chat.type === TChat.PRIVATE) {
					user = chat.hosts.find(
						(user) => user._id.toString() !== userId.toString()
					);
					avatar = user.avatar;
					name = user.first_name + ' ' + user.last_name;
					username = user.username;
				} else {
					avatar = chat.avatar;
					name = chat.name;
				}
				results.push({
					_id: chat._id,
					avatar,
					name,
					content: lastMessage ? lastMessage.content : null,
					...(username && { username }),
				});
			}

			return response.success('', results);
		} catch (error) {
			throw error;
		}
	},
	private: async (userId, username) => {
		try {
			const hosts = [userId];
			const type = TChat.PRIVATE;
			const user = await User.getByUsername(username);
			if (!user) {
				return response.error('User not found');
			}

			if (hosts.includes(user._id.toString())) {
				return response.error('User is already a host');
			} else {
				hosts.push(user._id);
			}

			const existingChat = await Chat.findExistingChat(hosts, type);
			if (existingChat) {
				return response.success('Chat already exists', {
					_id: existingChat._id,
				});
			}

			const chat = await Chat.create(null, null, hosts, [], null, type);
			if (chat) {
				return response.success('Chat created successfully', {
					_id: chat._id,
				});
			}
		} catch (error) {
			throw error;
		}
	},
};

export default ChatService;
