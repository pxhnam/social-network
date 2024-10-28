import Chat from '../services/ChatService.js';

class ChatController {
	Get = async (req, res) => {
		try {
			const userId = req.currentUserId;

			const result = await Chat.get(userId);
			return res.json(result);
		} catch (error) {
			console.log(error.message);
			return res
				.status(500)
				.json({ message: 'Something went wrong, please try again later' });
		}
	};
	Private = async (req, res) => {
		try {
			const { username } = req.body;
			const userId = req.currentUserId;

			const result = await Chat.private(userId, username);
			return res.json(result);
		} catch (error) {
			console.log(error.message);
			return res
				.status(500)
				.json({ message: 'Something went wrong, please try again later' });
		}
	};
}

export default new ChatController();
