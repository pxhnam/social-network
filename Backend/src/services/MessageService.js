import Message from '../repositories/MessageRepository.js';
import Chat from '../repositories/ChatRepository.js';
import response from '../helpers/Response.js';

const MessageService = {
	get: async (chatId, userId) => {
		try {
			const userInChat = Chat.checkUserInChat(chatId, userId);
			if (!userInChat) return response.error('Chat not found');
			let msgs = await Message.getByChatid(chatId);
			msgs = msgs.map((msg) => ({
				_id: msg._id,
				user: {
					avatar: msg.user.avatar,
					username: msg.user.username,
					name: msg.user.first_name + ' ' + msg.user.last_name,
				},
				content: msg.content,
				createdAt: msg.createdAt,
			}));
			return response.success('', msgs);
		} catch (error) {
			throw error;
		}
	},
	create: async (chatId, userId, content, attachments = []) => {
		try {
			if (!content || !content.trim()) {
				return response.error('Content is required');
			}
			const chat = await Chat.getById(chatId);
			if (!chat) {
				return response.error('Chat not found');
			}

			const msg = await Message.create(chatId, userId, content, attachments);
			if (msg) {
				return response.success('message created successfully', {
					_id: msg._id,
					chatId: msg.chat,
					members: [
						...chat.hosts.map((user) => user.username),
						...chat.members.map((user) => user.username),
					],
					content: msg.content,
					createdAt: msg.createdAt,
				});
			} else {
				return response.error('Message creation failed');
			}
		} catch (error) {
			throw error;
		}
	},
};

export default MessageService;
