import { useCallback, useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import UserChat from '../UserChat';
import { ChatContext } from '~/context/ChatProvider';
import SearchChat from './SearchChat';
import { debounce } from '~/utils/debounce';

const cx = classNames.bind(styles);

const SidebarChat = () => {
	const { chat, setChat, chatList } = useContext(ChatContext);
	const [list, setList] = useState();

	useEffect(() => {
		setList(chatList);
	}, [chatList]);

	const handleChat = useCallback((chat) => {
		setChat(chat);
	}, []);
	const handleAction = (e) => {
		e.stopPropagation();
	};

	const handleSearch = useCallback(
		debounce((e) => {
			const value = e.target.value;
			setList(
				chatList.filter(
					(user) =>
						user.username.toLowerCase().includes(value.toLowerCase()) ||
						user.name.toLowerCase().includes(value.toLowerCase())
				)
			);
		}, 500),
		[]
	);

	return (
		<div className={cx('sidebar')}>
			<div className={cx('sidebar-header')}>
				<SearchChat onChange={handleSearch} />
			</div>
			<div className={cx('list')}>
				{list?.length > 0 &&
					list.map((userChat) => (
						<UserChat
							key={userChat?._id}
							avatar={userChat?.avatar}
							name={userChat?.name}
							time=''
							content={userChat?.content}
							online={userChat?.isOnline}
							onClick={() => handleChat(userChat)}
							onAction={handleAction}
							active={chat?._id === userChat?._id}
						/>
					))}
			</div>
		</div>
	);
};

export default SidebarChat;
