import Chat from '../models/Chat.js';

const ChatRepository = {
	getByUserId: async (userId) => {
		try {
			const chats = await Chat.find({
				$or: [{ hosts: userId }, { members: userId }],
			}).populate('hosts members');
			return chats;
		} catch (error) {
			throw error;
		}
	},
	getById: async (_id) => {
		try {
			const chat = await Chat.findById(_id).populate('hosts members');
			return chat;
		} catch (error) {
			throw error;
		}
	},
	exists: async (_id) => {
		try {
			const chat = await Chat.findOne({ _id });
			return chat !== null;
		} catch (error) {
			throw error;
		}
	},
	checkUserInChat: async (chatId, userId) => {
		try {
			return await Chat.isUserInChat(chatId, userId);
		} catch (error) {
			throw error;
		}
	},
	create: async (avatar, name, hosts, members, inviteCode, type) => {
		try {
			const chat = new Chat({ avatar, name, hosts, members, inviteCode, type });
			await chat.save();
			return chat;
		} catch (error) {
			throw error;
		}
	},
	findExistingChat: async (Ids, type) => {
		try {
			const chat = await Chat.findOne({
				hosts: { $all: Ids },
				type: type,
			});
			return chat;
		} catch (error) {
			throw error;
		}
	},
};

export default ChatRepository;
