import Comment from '../services/CommentService.js';

class CommentController {
	Get = async (req, res) => {
		try {
			const postId = req.params.id;
			const { total, limit } = req.query;

			const result = await Comment.get(postId, total, limit);
			return res.json(result);
		} catch (error) {
			console.log(error.message);
			return res
				.status(500)
				.json({ message: 'Something went wrong, please try again later' });
		}
	};
	Count = async (req, res) => {
		try {
			const postId = req.params.id;

			const result = await Comment.count(postId);
			return res.json(result);
		} catch (error) {
			console.log(error.message);
			return res
				.status(500)
				.json({ message: 'Something went wrong, please try again later' });
		}
	};
	Create = async (req, res) => {
		try {
			const { postId, content, attachments } = req.body;
			const userId = req.currentUserId;

			const result = await Comment.create(userId, postId, content, attachments);
			return res.json(result);
		} catch (error) {
			console.log(error.message);
			return res
				.status(500)
				.json({ message: 'Something went wrong, please try again later' });
		}
	};
	Remove = async (req, res) => {
		try {
			const { id } = req.params;
			const userId = req.currentUserId;

			const result = await Comment.remove(id, userId);
			return res.json(result);
		} catch (error) {
			console.log(error.message);
			return res
				.status(500)
				.json({ message: 'Something went wrong, please try again later' });
		}
	};
}

export default new CommentController();
