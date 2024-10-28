import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { AuthContext } from '~/context/AuthProvider';
import chatService from '~/services/ChatService';
import messageService from '~/services/MessageService';
import styles from './styles.module.scss';
import { MyMessage, OtherMessage, UserChat } from '~/components/Chat';
import HeaderChat from '~/components/Chat/HeaderChat';
import { SearchIcon } from '~/components/Icons';
import CreateRoom from '~/components/Modals/CreateRoom';

const cls = classNames.bind(styles);

function ChatPage() {
	const [users, setUsers] = useState([]);
	const [user, setUser] = useState();
	const [messages, setMessages] = useState([]);
	const [content, setContent] = useState('');
	const [isOpen, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(true);
	const chatContentRef = useRef(null);
	const { auth, socket, onlineUsers } = useContext(AuthContext);
	const { room } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (!auth) navigate('/');
		if (room && !user) navigate('/chats');
		(async () => {
			try {
				const response = await chatService.get();
				if (response?.status) {
					setUsers(response?.data || []);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	useEffect(() => {
		if (socket) {
			socket.on('updateMessage', (data) => {
				if (data && data?.chatId === room) {
					setMessages((msgs) => [...msgs, data]);
				}
			});
		}
		return () => {
			socket.off('updateMessage');
		};
	}, [socket, room]);

	useEffect(() => {
		if (chatContentRef.current) {
			chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
		}
	}, [messages]);

	useEffect(() => {
		if (user) {
			const isOnline = onlineUsers.some(
				(onlUser) => onlUser.username === user.username
			);
			setUser({ ...user, isOnline });
		}
	}, [onlineUsers]);

	useEffect(() => {
		if (!loading) {
			const data = users.find((u) => u.chatId === room) || null;
			if (data) {
				setUser(data);
				(async () => {
					const response = await messageService.get(data.chatId);
					if (response?.status) {
						setMessages(response?.data || []);
					}
				})();
			}
		}
	}, [room, loading]);

	const handleChat = useCallback((chatId) => {
		navigate('/chats/' + chatId);
	});

	const handleKeyDown = async (e) => {
		try {
			if (e.key === 'Enter') {
				if (content.trim()) {
					const response = await messageService.create(room, content);
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
					setContent('');
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className={cls('wrapper')}>
			<div className={cls('user-list')}>
				<div className={cls('user-list__header')}>
					<div className={cls('wrapper-header')}>
						<div>
							<button onClick={() => setOpenModal(true)}>Create</button>
							<CreateRoom state={isOpen} setState={setOpenModal} />
						</div>
						<div className={cls('box-search')}>
							<span>
								<SearchIcon />
							</span>
							<input type='text' placeholder='Search...' />
						</div>
					</div>
				</div>
				<div className={cls('user-list__items')}>
					{users.map((user) => {
						const isOnline = onlineUsers.some(
							(onlUser) => onlUser.username === user.username
						);
						const isActive = user.chatId === room;
						return (
							<UserChat
								key={user.chatId}
								avatar={user.avatar}
								name={user.name}
								// content='Hehe!'
								// time='5 giờ'
								online={isOnline}
								active={isActive}
								onClick={() => handleChat(user.chatId)}
							/>
						);
					})}
				</div>
			</div>
			<div className={cls('chat')}>
				<div className={cls('chat-header')}>
					{user && (
						<HeaderChat
							avatar={user.avatar}
							name={user.name}
							active={user.isOnline}
						/>
					)}
				</div>
				{user ? (
					<>
						<div className={cls('chat-content')} ref={chatContentRef}>
							{messages && messages.length > 0 ? (
								messages.map((msg) => {
									return auth.username === msg.user.username ? (
										<MyMessage key={msg._id} content={msg.content} />
									) : (
										<OtherMessage
											key={msg._id}
											avatar={msg.user.avatar}
											name={msg.user.name}
											content={msg.content}
										/>
									);
								})
							) : (
								<div
									style={{
										color: '#656565',
										textAlign: 'center',
										fontSize: '15px',
										marginTop: '15px',
									}}
								>
									<p>Chưa có tin nhắn nào.</p>
								</div>
							)}
						</div>

						<div className={cls('chat-input')}>
							<input
								type='text'
								placeholder='Aa'
								onKeyDown={handleKeyDown}
								value={content}
								onChange={(e) => setContent(e.target?.value)}
							/>
						</div>
					</>
				) : (
					<div style={{ textAlign: 'center', marginTop: '12px' }}>
						<p>Hãy chọn cuộc trò chuyện</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default ChatPage;
