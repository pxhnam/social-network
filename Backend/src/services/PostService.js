import Post from '../repositories/PostRepository.js';
import User from '../repositories/UserRepository.js';
import Attachment from '../repositories/AttachmentRepository.js';
import TAttachment from '../constants/TAttachment.js';
import { timeCount } from '../utils/date.js';
import response from '../helpers/Response.js';

const BASE_URL = 'http://127.0.0.1:' + process.env.PORT;

const PostService = {
	get: async (userId, username, total, limit) => {
		try {
			let posts = null;
			if (username) {
				const user = await User.getByUsername(username);
				if (user) {
					posts = await Post.getByUserId(user._id, total, limit);
				} else {
					return response.error('Error fetching posts.');
				}
			} else {
				posts = await Post.get(total, limit);
			}

			posts = await posts.map((post) => ({
				_id: post._id,
				author: {
					avatar: post.user.avatar,
					username: post.user.username,
					name: post.user.first_name + ' ' + post.user.last_name,
				},
				content: post.content,
				isLiked: userId ? post.isLiked(userId) : false,
				likeCount: post.getLikeCount(),
				createdAt: timeCount(post.createdAt),
				attachments: post.attachments.map((attachment) => ({
					_id: attachment._id,
					type: attachment.type,
					url: BASE_URL + attachment.url,
				})),
			}));

			return response.success('', posts);
		} catch (error) {
			throw error;
		}
	},
	update: async (userId, postId, content, attachments, _files) => {
		try {
			if (postId) {
				const isAuthor = await Post.isAuthor(userId, postId);

				if (!isAuthor) {
					return response.error('You are not authorized to edit this post.');
				}
			}

			if (!content || !content.trim()) {
				return response.error('Content is required');
			}

			if (attachments && attachments.length > 0) {
				attachments = attachments.map((file) => {
					const type = file.mimetype.startsWith(TAttachment.IMAGE)
						? TAttachment.IMAGE
						: TAttachment.VIDEO;
					const url = '/uploads/' + file.filename;
					return { type, url };
				});
			} else {
				attachments = [];
			}
			attachments = await Attachment.createMany(attachments);

			if (postId) {
				const post = await Post.update(
					postId,
					content,
					attachments.map((att) => att._id)
				);
				if (post) {
					if (_files) {
						_files = JSON.parse(_files);
						if (Array.isArray(_files) && _files?.length > 0) {
							post.attachments = post.attachments.filter(
								(id) => !_files.includes(id.toString())
							);
						}
					}
					await post.save();
					return response.success('Post edited successfully');
				}
			} else {
				const post = await Post.create(
					userId,
					content,
					attachments.map((att) => att._id)
				);
				if (post) {
					return response.success('Post created successfully', post);
				}
			}
		} catch (error) {
			throw error;
		}
	},
	toggleLike: async (postId, userId) => {
		try {
			const post = await Post.findById(postId);
			if (post) {
				post.toggleLike(userId);
				return response.success('Like successfully!');
			} else {
				return response.error('Post not found!');
			}
		} catch (error) {
			throw error;
		}
	},
	remove: async (postId, userId) => {
		try {
			const isAuthor = await Post.isAuthor(userId, postId);
			if (isAuthor) {
				await Post.remove(postId);
				return response.success('Post deleted successfully');
			} else {
				return response.error('You are not authorized to delete this post.');
			}
		} catch (error) {
			throw error;
		}
	},
};

export default PostService;
