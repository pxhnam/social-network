import Comment from '../models/Comment.js';

const CommentRepository = {
	get: async () => {
		try {
			const comments = await Comment.find().populate('user');
			// .sort({ createdAt: -1 });
			return comments;
		} catch (error) {
			throw error;
		}
	},
	getById: async (id) => {
		try {
			const cmt = await Comment.findById(id);
			return cmt;
		} catch (error) {
			throw error;
		}
	},

	getByPostId: async (postId, total = 0, limit = 0) => {
		try {
			var comments = Comment.find({ post: postId })
				.populate('user')
				.sort({ createdAt: -1 });

			if (limit > 0) {
				comments.skip(total).limit(limit);
			}
			comments = await comments;
			return comments;
		} catch (error) {
			throw error;
		}
	},

	countByPostId: async (postId) => {
		try {
			const count = await Comment.countDocuments({ post: postId });
			return count;
		} catch (error) {
			throw error;
		}
	},

	create: async (postId, userId, content, attachments = []) => {
		try {
			const comment = new Comment({
				post: postId,
				user: userId,
				content,
				attachments,
			});
			await comment.save();
			return comment;
		} catch (error) {
			throw error;
		}
	},

	remove: async (id) => {
		try {
			const cmt = await Comment.findByIdAndDelete(id);
			return cmt;
		} catch (error) {
			throw error;
		}
	},
};

export default CommentRepository;
