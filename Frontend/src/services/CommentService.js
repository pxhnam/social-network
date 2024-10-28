import axios from 'axios';
const SERVICE = '/comments/';

const CommentService = {
	get: async (postId, total = 0, limit = 0) => {
		try {
			const response = await axios.get(SERVICE + postId, {
				params: {
					total,
					limit,
				},
			});
			return response.data;
		} catch (error) {
			return error.response;
		}
	},
	count: async (postId) => {
		try {
			const response = await axios.get(SERVICE + 'count/' + postId);
			return response.data;
		} catch (error) {
			return error.response;
		}
	},
	create: async (postId, content, attachments) => {
		try {
			const response = await axios.post(SERVICE, {
				postId,
				content,
				attachments,
			});
			return response.data;
		} catch (error) {
			return error.response;
		}
	},
	remove: async (id) => {
		try {
			const response = await axios.delete(SERVICE + id);
			return response.data;
		} catch (error) {
			return error.response;
		}
	},
};
export default CommentService;
