import axios from 'axios';
const SERVICE = '/chats/';

const ChatService = {
	get: async () => {
		try {
			const response = await axios.get(SERVICE);
			return response.data;
		} catch (error) {
			return error.response;
		}
	},
	private: async (username) => {
		try {
			const response = await axios.post(SERVICE + 'private', {
				username,
			});
			return response.data;
		} catch (error) {
			return error.response;
		}
	},
};
export default ChatService;
