import Message from '../models/Message.js';

const MessageRepository = {
	getByChatid: async (chatId) => {
		try {
			const messages = await Message.find({ chat: chatId })
				.populate('user')
				.populate('attachments')
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
	getLatestByChatId: async (chatId) => {
		try {
			const latestMessage = await Message.findOne({ chat: chatId }).sort({
				createdAt: -1,
			});
			return latestMessage;
		} catch (error) {
			throw error;
		}
	},
};

export default MessageRepository;
