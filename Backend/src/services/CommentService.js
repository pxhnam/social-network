import Comment from '../repositories/CommentRepository.js';
import { timeCount } from '../utils/date.js';
import response from '../helpers/Response.js';

const CommentService = {
	get: async (postId, total, limit) => {
		try {
			let comments = await Comment.getByPostId(postId, total, limit);
			comments = comments.reverse().map((comment) => ({
				_id: comment.id,
				content: comment.content,
				avatar: comment.user.avatar,
				username: comment.user.username,
				name: comment.user.first_name + ' ' + comment.user.last_name,
				createdAt: timeCount(comment.createdAt),
			}));
			return response.success('', comments);
		} catch (error) {
			throw error;
		}
	},
	create: async (userId, postId, content, attachments) => {
		try {
			if (!content || !content.trim()) {
				return response.error('Content is required');
			}

			const comment = await Comment.create(
				postId,
				userId,
				content,
				attachments
			);
			if (comment) {
				const cmt = {
					_id: comment._id,
					postId: comment.post,
					content: comment.content,
					createdAt: timeCount(comment.createdAt),
				};
				return response.success('Comment created successfully', cmt);
			} else {
				return response.success('Comment creation failed');
			}
		} catch (error) {
			throw error;
		}
	},
	remove: async (id, userId) => {
		try {
			const cmt = await Comment.getById(id);
			if (cmt.user.toString() === userId) {
				await Comment.remove(id);
				return response.success('');
			} else {
				return response.error(
					'You do not have permission to delete this comment.'
				);
			}
		} catch (error) {
			throw error;
		}
	},
	count: async (postId) => {
		try {
			const count = await Comment.countByPostId(postId);
			return response.success('', { count });
		} catch (error) {
			throw error;
		}
	},
};

export default CommentService;
