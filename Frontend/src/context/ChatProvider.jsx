import { act, createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthProvider';
import chatService from '~/services/ChatService';
import messageService from '~/services/MessageService';

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
	const { auth, socket, onlineUsers } = useContext(AuthContext);
	const [chat, setChat] = useState(null);
	const [chatList, setChatList] = useState([]);
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		if (socket && auth) {
			socket.on('updateMessage', (data) => {
				if (data && data?.chatId === chat.chatId) {
					setMessages((msgs) => [...msgs, data]);
				}
			});
		}
		return () => {
			if (socket) {
				socket.off('updateMessage');
			}
		};
	}, [socket, chat]);

	useEffect(() => {
		if (auth) {
			(async () => {
				try {
					const response = await chatService.get();
					if (response?.status) {
						setChatList(response?.data || []);
					}
				} catch (error) {
					console.log(error);
				}
			})();
		} else {
			setChat(null);
		}
	}, [auth]);

	useEffect(() => {
		if (auth && chatList?.length > 0) {
			const data = chatList.map((chat) => {
				const isOnline = onlineUsers.some(
					(user) => user.username === chat.username
				);
				return { ...chat, isOnline };
			});
			setChatList(data);
		}
	}, [onlineUsers]);

	useEffect(() => {
		try {
			if (chat) {
				(async () => {
					const response = await messageService.get(chat.chatId);
					if (response?.status) {
						setMessages(response?.data || []);
					}
				})();
			} else {
				setMessages([]);
			}
		} catch (error) {
			setMessages([]);
			console.log(error);
		}
	}, [chat]);

	const handleSendMessgae = async (formData) => {
		try {
			if (chat) {
				const response = await messageService.create(formData);
				if (response?.status) {
					const data = {
						...response?.data,
						user: {
							avatar: auth.avatar,
							username: auth.username,
							name: auth.name,
						},
					};
					socket.emit('sendMessage', data);
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<ChatContext.Provider
			value={{ chat, setChat, chatList, messages, handleSendMessgae }}
		>
			{auth && children}
		</ChatContext.Provider>
	);
};

export default ChatProvider;
