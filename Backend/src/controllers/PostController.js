import Post from '../services/PostService.js';

class PostController {
	Get = async (req, res) => {
		try {
			const { total, limit } = req.query;
			const userId = req.currentUserId;

			const result = await Post.get(userId, null, total, limit);
			return res.json(result);
		} catch (error) {
			console.log(error.message);
			return res
				.status(500)
				.json({ message: 'Something went wrong, please try again later' });
		}
	};

	Auth = async (req, res) => {
		try {
			const { username } = req.params;
			const { total, limit } = req.query;
			const userId = req.currentUserId;

			const result = await Post.get(userId, username, total, limit);
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
			const { content } = req.body;
			const userId = req.currentUserId;
			const attachments = req.files;
			const result = await Post.update(userId, null, content, attachments);

			return res.json(result);
		} catch (error) {
			console.log(error.message);
			return res
				.status(500)
				.json({ message: 'Something went wrong, please try again later' });
		}
	};

	Update = async (req, res) => {
		try {
			const { id, content } = req.body;
			const userId = req.currentUserId;
			const attachments = req.files;

			const result = await Post.update(userId, id, content, attachments);

			return res.json(result);
		} catch (error) {
			console.log(error.message);
			return res
				.status(500)
				.json({ message: 'Something went wrong, please try again later' });
		}
	};
	ToggleLike = async (req, res) => {
		try {
			const { postId } = req.body;
			const userId = req.currentUserId;
			const result = await Post.toggleLike(postId, userId);
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

			const result = await Post.remove(userId, id);

			return res.json(result);
		} catch (error) {
			console.log(error.message);
			return res
				.status(500)
				.json({ message: 'Something went wrong, please try again later' });
		}
	};
}

export default new PostController();
