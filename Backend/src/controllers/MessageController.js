import Message from '../services/MessageService.js';

class messageController {
	Get = async (req, res) => {
		try {
			const { chatId } = req.params;
			const userId = req.currentUserId;
			const result = await Message.get(chatId, userId);
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
			const { chatId, username, content } = req.body;
			const userId = req.currentUserId;
			const attachments = req.files;

			const result = await Message.create(
				chatId,
				username,
				userId,
				content,
				attachments
			);
			return res.json(result);
		} catch (error) {
			console.log(error.message);
			return res
				.status(500)
				.json({ message: 'Something went wrong, please try again later' });
		}
	};
}

export default new messageController();
