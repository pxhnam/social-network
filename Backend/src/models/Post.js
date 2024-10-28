import mongoose from 'mongoose';

const Post = new mongoose.Schema(
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
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	{ timestamps: true }
);

Post.methods.getLikeCount = function () {
	return this.likes.length;
};

Post.methods.toggleLike = function (userId) {
	const index = this.likes.indexOf(userId);
	if (index === -1) {
		this.likes.push(userId);
	} else {
		this.likes.splice(index, 1);
	}

	return this.save();
};

Post.methods.isLiked = function (userId) {
	return this.likes.includes(userId);
};

export default new mongoose.model('Post', Post);
