import Message from '../repositories/MessageRepository.js';
import Chat from '../repositories/ChatRepository.js';
import Attachment from '../repositories/AttachmentRepository.js';
import TAttachment from '../constants/TAttachment.js';
import response from '../helpers/Response.js';

const BASE_URL = 'http://127.0.0.1:' + process.env.PORT;

const MessageService = {
	get: async (chatId, userId) => {
		try {
			const userInChat = Chat.checkUserInChat(chatId, userId);
			if (!userInChat) return response.error('Chat not found');
			let msgs = await Message.getByChatid(chatId);
			msgs = msgs.map((msg) => ({
				_id: msg._id,
				user: {
					avatar: msg.user.avatar,
					username: msg.user.username,
					name: msg.user.first_name + ' ' + msg.user.last_name,
				},
				content: msg.content,
				attachments: msg.attachments.map((attachment) => ({
					_id: attachment._id,
					type: attachment.type,
					url: BASE_URL + attachment.url,
				})),
				createdAt: msg.createdAt,
			}));
			return response.success('', msgs);
		} catch (error) {
			throw error;
		}
	},
	create: async (chatId, userId, content, attachments = []) => {
		try {
			if (!content || !content.trim()) {
				return response.error('Content is required');
			}
			const chat = await Chat.getById(chatId);
			if (!chat) {
				return response.error('Chat not found');
			}
			if (attachments.length > 0) {
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

			const msg = await Message.create(
				chatId,
				userId,
				content,
				attachments.map((att) => att._id)
			);
			if (msg) {
				return response.success('message created successfully', {
					_id: msg._id,
					chatId: msg.chat,
					members: [
						...chat.hosts.map((user) => user.username),
						...chat.members.map((user) => user.username),
					],
					content: msg.content,
					attachments: attachments.map((attachment) => ({
						_id: attachment._id,
						type: attachment.type,
						url: BASE_URL + attachment.url,
					})),
					createdAt: msg.createdAt,
				});
			} else {
				return response.error('Message creation failed');
			}
		} catch (error) {
			throw error;
		}
	},
};

export default MessageService;
