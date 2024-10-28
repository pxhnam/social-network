import mongoose from 'mongoose';
import TChat from '../constants/TChat.js';

const Chat = new mongoose.Schema(
	{
		avatar: {
			type: String,
		},
		name: {
			type: String,
		},
		hosts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				required: true,
			},
		],
		members: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		inviteCode: {
			type: String,
			unique: true,
			sparse: true,
		},
		type: {
			type: String,
			enum: TChat.values(),
			default: TChat.PRIVATE,
			required: true,
		},
	},
	{ timestamps: true }
);

Chat.virtual('messages', {
	ref: 'Message',
	localField: '_id',
	foreignField: 'chat',
});

Chat.statics.isUserInChat = async function (chatId, userId) {
	const chat = await this.findOne({ _id: chatId });
	if (!chat) return false;
	return chat.members.includes(userId) || chat.hosts.includes(userId);
};

export default new mongoose.model('Chat', Chat);
