import mongoose from 'mongoose';

const Reply = new mongoose.Schema(
	{
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

const Comment = new mongoose.Schema(
	{
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
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
		replies: [Reply],
	},
	{ timestamps: true }
);

export default new mongoose.model('Comment', Comment);
