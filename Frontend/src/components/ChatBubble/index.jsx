import { useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { ChatBubbleIcon, ChevronDownIcon } from '~/components/Icons';
import WelcomeChat from './WelcomeChat';
import Conversation from './Conversation';
import SidebarChat from './SidebarChat';
import { ChatContext } from '~/context/ChatProvider';

const cx = classNames.bind(styles);

const ChatBubble = () => {
	const { chat } = useContext(ChatContext);
	const [isActive, setActive] = useState(false);
	const [isHovered, setHovered] = useState(false);

	useEffect(() => {
		if (isActive) {
			document.body.style.overflow = isHovered ? 'hidden' : 'auto';
		}

		return () => {
			document.body.style.overflow = 'auto';
		};
	}, [isActive, isHovered]);

	return ReactDOM.createPortal(
		<div
			className={cx('wrapper', { active: isActive })}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			<div className={cx('intro')} onClick={() => setActive(true)}>
				<ChatBubbleIcon />
				<p>Chat</p>
			</div>
			<div className={cx('box-chat')}>
				<div className={cx('header')}>
					<p className={cx('title')}>Chat</p>
					<span onClick={() => setActive(false)}>
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
	);
};

export default ChatBubble;
