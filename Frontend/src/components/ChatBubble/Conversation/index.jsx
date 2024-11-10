import { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { ChatContext } from '~/context/ChatProvider';
import Message from './Message';
import styles from './styles.module.scss';
import {
	ChevronDownIcon,
	CloseIcon,
	FaceSmileIcon,
	ImageIcon,
} from '~/components/Icons';

const cx = classNames.bind(styles);

const Conversation = () => {
	const { chat, messages, handleSendMessgae } = useContext(ChatContext);
	const [files, setFiles] = useState([]);
	const [text, setText] = useState('');
	const messagesRef = useRef(null);

	useEffect(() => {
		if (messagesRef.current) {
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
		}
	}, [messages]);

	useEffect(() => {
		return () => {
			files.map((file) => {
				URL.revokeObjectURL(file.preview);
			});
		};
	}, [files]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (text.trim()) {
			const formData = new FormData();
			if (chat?._id) {
				formData.append('chatId', chat._id);
			} else {
				formData.append('username', chat.username);
			}
			formData.append('content', text);
			files.map((file) => {
				formData.append('attachments', file);
			});
			handleSendMessgae(formData);
			setText('');
			setFiles([]);
		}
	};

	const handleUpImages = () => {
		document.querySelector('#input-files').click();
	};

	const handleChangeFiles = (e) => {
		const temps = Array.from(e.target.files);
		const previewImages = temps.map((file) => {
			file.preview = URL.createObjectURL(file);
			return file;
		});
		e.target.value = null;
		setFiles(previewImages);
	};

	const handleRemoveFile = (fileName) => {
		setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
	};

	return (
		<div className={cx('conversation')}>
			<div className={cx('header')}>
				<div className={cx('info-action')}>
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
							files={msg.attachments}
						/>
					))
				) : (
					<div className={cx('box-empty')}>
						<p>No messages yet</p>
					</div>
				)}
			</div>
			<form className={cx('input')} onSubmit={handleSubmit}>
				{files.length > 0 && (
					<div className={cx('preview-attachments')}>
						{files.map((file) => (
							<div key={file.name} className={cx('image-container')}>
								<img src={file.preview} alt={file.name} />
								<span
									className={cx('close')}
									onClick={() => handleRemoveFile(file.name)}
								>
									<CloseIcon />
								</span>
							</div>
						))}
					</div>
				)}
				<input
					type='text'
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder='Enter message content...'
				/>
				<div className={cx('attachments')}>
					<span>
						<FaceSmileIcon />
					</span>
					<input
						type='file'
						id='input-files'
						style={{ display: 'none' }}
						accept='image/*,video/*'
						onChange={handleChangeFiles}
						multiple
					/>
					<span onClick={handleUpImages}>
						<ImageIcon />
					</span>
				</div>
			</form>
		</div>
	);
};

export default Conversation;
