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
	create: async (chatId, content) => {
		try {
			const response = await axios.post(SERVICE, {
				chatId,
				content,
			});
			return response.data;
		} catch (error) {
			return error.response;
		}
	},
};
export default MessageService;
