import Message from '../models/Message.js';

const MessageRepository = {
	getByChatid: async (chatId) => {
		try {
			const messages = await Message.find({ chat: chatId })
				.populate('user')
				.sort({ createdAt: 1 });
			return messages;
		} catch (error) {
			throw error;
		}
	},
	create: async (chat, user, content, attachments) => {
		try {
			const msg = new Message({ chat, user, content, attachments });
			return await msg.save();
		} catch (error) {
			throw error;
		}
	},
};

export default MessageRepository;
