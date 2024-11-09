import axios from 'axios';
const SERVICE = '/messages/';

const MessageService = {
	get: async (chatId) => {
		try {
			const response = await axios.get(SERVICE + chatId);
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
};
export default MessageService;
