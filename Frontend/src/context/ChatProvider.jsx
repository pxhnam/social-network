import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import chatService from '~/services/ChatService';
import messageService from '~/services/MessageService';

export const ChatContext = createContext();

export const useChat = () => {
	return useContext(ChatContext);
};

const ChatProvider = ({ children }) => {
	const { auth, socket, onlineUsers } = useAuth();
	const [chat, setChat] = useState(null);
	const [isOpenChat, setOpenChat] = useState(false);
	const [chatList, setChatList] = useState([]);
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		if (socket && auth) {
			socket.on('updateMessage', (data) => {
				if (data && data?.chatId === chat?._id) {
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
			if (chat && chat?._id) {
				(async () => {
					const response = await messageService.get(chat?._id);
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
					const data = response?.data;
					if (!data) return;
					if (data?.username === chat.username && data?.chatId) {
						setChat((prevChat) => ({
							...prevChat,
							_id: data.chatId,
						}));
						setChatList((prevList) =>
							prevList.map((chatItem) =>
								chatItem.username === data?.username
									? { ...chatItem, _id: data.chatId }
									: chatItem
							)
						);
					}
					socket.emit('sendMessage', {
						...data,
						user: {
							avatar: auth.avatar,
							username: auth.username,
							name: auth.name,
						},
					});
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<ChatContext.Provider
			value={{
				chat,
				setChat,
				isOpenChat,
				setOpenChat,
				chatList,
				setChatList,
				messages,
				handleSendMessgae,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};

export default ChatProvider;
