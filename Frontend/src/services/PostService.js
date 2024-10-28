import axios from 'axios';
const SERVICE = '/posts/';

const PostService = {
	get: async (total = 0, limit = 0) => {
		try {
			const response = await axios.get(SERVICE, {
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

	auth: async (username, total = 0, limit = 0) => {
		try {
			const response = await axios.get(SERVICE + 'auth/' + username, {
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

	create: async (formData) => {
		try {
			const response = await axios.post(SERVICE, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			return response.data;
		} catch (error) {
			return error.response;
		}
	},

	update: async (formData) => {
		try {
			const response = await axios.put(SERVICE, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			return response.data;
		} catch (error) {
			return error.response;
		}
	},

	toggleLike: async (postId) => {
		try {
			const response = await axios.post(SERVICE + 'like', { postId });
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
export default PostService;
