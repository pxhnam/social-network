import mongoose from 'mongoose';

const Message = new mongoose.Schema(
	{
		chat: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Chat',
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		attachments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Attachment',
			},
		],
	},
	{ timestamps: true }
);

export default new mongoose.model('Message', Message);
