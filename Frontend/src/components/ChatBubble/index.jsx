import { useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { ChatBubbleIcon, ChevronDownIcon } from '~/components/Icons';
import WelcomeChat from './WelcomeChat';
import Conversation from './Conversation';
import SidebarChat from './SidebarChat';
import { ChatContext } from '~/context/ChatProvider';
import { AuthContext } from '~/context/AuthProvider';

const cx = classNames.bind(styles);

const ChatBubble = () => {
	const { auth } = useContext(AuthContext);
	const { chat, isOpenChat, setOpenChat } = useContext(ChatContext);
	const [isHovered, setHovered] = useState(false);

	useEffect(() => {
		!auth && setOpenChat(false);
	}, [auth]);
	useEffect(() => {
		if (isOpenChat) {
			document.body.style.overflow = isHovered ? 'hidden' : 'auto';
		}

		return () => {
			document.body.style.overflow = 'auto';
		};
	}, [isOpenChat, isHovered]);

	return (
		auth &&
		ReactDOM.createPortal(
			<div
				className={cx('wrapper', { active: isOpenChat })}
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
			>
				<div className={cx('intro')} onClick={() => setOpenChat(true)}>
					<ChatBubbleIcon />
					<p>Chat</p>
				</div>
				<div className={cx('box-chat')}>
					<div className={cx('header')}>
						<p className={cx('title')}>Chat</p>
						<span onClick={() => setOpenChat(false)}>
							<ChevronDownIcon />
						</span>
					</div>
					<div className={cx('main')}>
						<SidebarChat />
						<div className={cx('content')}>
							{chat ? <Conversation /> : <WelcomeChat />}
						</div>
					</div>
				</div>
			</div>,
			document.body
		)
	);
};

export default ChatBubble;
