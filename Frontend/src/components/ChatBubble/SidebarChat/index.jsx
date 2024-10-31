import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { SearchIcon } from '~/components/Icons';
import UserChat from '../UserChat';
import { useCallback, useContext } from 'react';
import { ChatContext } from '~/context/ChatProvider';

const cx = classNames.bind(styles);

const SidebarChat = () => {
	const { chatList, setChat, chat } = useContext(ChatContext);

	const handleChat = useCallback((chat) => {
		setChat(chat);
	}, []);

	return (
		<div className={cx('sidebar')}>
			<div className={cx('sidebar-header')}>
				<div className={cx('form-input')}>
					<SearchIcon />
					<input type='text' placeholder='Search...' />
				</div>
			</div>
			<div className={cx('list')}>
				{chatList?.length > 0 &&
					chatList.map((chatItem) => (
						<UserChat
							key={chatItem.chatId}
							avatar={chatItem.avatar}
							name={chatItem.name}
							time='2 giờ'
							content={chatItem.content}
							online={chatItem?.isOnline}
							onClick={() => handleChat(chatItem)}
							active={chat?.username === chatItem.username}
						/>
					))}
			</div>
		</div>
	);
};

export default SidebarChat;
