import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import Message from './Message';
import { ChevronDownIcon, FaceSmileIcon, ImageIcon } from '~/components/Icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { ChatContext } from '~/context/ChatProvider';

const cx = classNames.bind(styles);

const Conversation = () => {
	const { chat, messages, setMessage } = useContext(ChatContext);
	const [text, setText] = useState('');
	const messagesRef = useRef(null);

	useEffect(() => {
		if (messagesRef.current) {
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
		}
	}, [messages]);

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			if (text.trim()) {
				setMessage(text);
				setText('');
			}
		}
	};

	return (
		<div className={cx('conversation')}>
			<div className={cx('header')}>
				<div className={cx('action')}>
					<p>{chat?.name}</p>
					<span>
						<ChevronDownIcon />
					</span>
				</div>
			</div>
			<div className={cx('messages')} ref={messagesRef}>
				{messages?.length > 0 ? (
					messages.map((msg) => (
						<Message
							key={msg._id}
							direction={msg.user.username === chat.username ? 'left' : 'right'}
							content={msg.content}
						/>
					))
				) : (
					<div className={cx('box-empty')}>
						<p>No messages yet</p>
					</div>
				)}
			</div>
			<div className={cx('input')}>
				<input
					type='text'
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder='Enter message content...'
					onKeyDown={handleKeyDown}
				/>
				<div className={cx('attachments')}>
					<span>
						<FaceSmileIcon />
					</span>
					<span>
						<ImageIcon />
					</span>
				</div>
			</div>
		</div>
	);
};

export default Conversation;
