import Post from '../models/Post.js';

const PostRepository = {
	get: async (total = 0, limit = 0) => {
		try {
			var posts = Post.find()
				.populate('user')
				.populate('attachments')
				.sort({ createdAt: -1 });
			if (limit > 0) {
				posts.skip(total).limit(limit);
			}

			posts = await posts;
			return posts;
		} catch (error) {
			throw error;
		}
	},
	getByUserId: async (userId, total = 0, limit = 0) => {
		try {
			var posts = Post.find({ user: userId })
				.populate('user')
				.populate('attachments')
				.sort({ createdAt: -1 });
			if (limit > 0) {
				posts.skip(total).limit(limit);
			}

			posts = await posts;
			return posts;
		} catch (error) {
			throw error;
		}
	},
	findById: async (id) => {
		try {
			const post = await Post.findById(id)
				.populate('user')
				.populate('attachments');
			return post;
		} catch (error) {
			throw error;
		}
	},

	getPostByAttachmentId: async (attId) => {
		try {
			const post = await Post.findOne({
				// attachments: { $in: [attId] },
				attachments: attId,
			});
			return post;
		} catch (error) {
			throw error;
		}
	},

	create: async (user, content, attachments = []) => {
		try {
			const post = new Post({
				user,
				content,
				attachments,
			});
			await post.save();
			return post;
		} catch (error) {
			throw error;
		}
	},

	update: async (id, content, attachments = []) => {
		try {
			const post = await Post.findById(id);

			if (!post) {
				return false;
			}

			post.content = content || post.content;
			post.attachments = attachments.length
				? [...post.attachments, ...attachments]
				: post.attachments;

			await post.save();
			return post;
		} catch (error) {
			throw error;
		}
	},

	isAuthor: async (userId, postId) => {
		try {
			const post = await Post.findById(postId);
			if (!post) {
				return false;
			}
			return post.user._id.toString() === userId.toString();
		} catch (error) {
			throw error;
		}
	},

	remove: async (id) => {
		try {
			const post = await Post.findByIdAndDelete(id);
			return post;
		} catch (error) {
			throw error;
		}
	},
};
export default PostRepository;
