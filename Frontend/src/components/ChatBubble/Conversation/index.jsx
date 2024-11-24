import { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { useChat } from '~/context/ChatProvider';
import Message from './Message';
import styles from './styles.module.scss';
import {
	ChevronDownIcon,
	CloseIcon,
	FaceSmileIcon,
	ImageIcon,
	InfoCircleIcon,
} from '~/components/Icons';

const cx = classNames.bind(styles);

const Conversation = () => {
	const { chat, messages, handleSendMessgae } = useChat();
	const [files, setFiles] = useState([]);
	const [text, setText] = useState('');
	const msgEndRef = useRef(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			msgEndRef.current &&
				msgEndRef.current.scrollIntoView({ behaviour: 'smooth' });
		}, 50);

		return () => clearTimeout(timer);
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

	const handleMessage = useCallback(() => {
		console.log('click');
	}, [messages]);

	return (
		<div className={cx('conversation')}>
			<div className={cx('header')}>
				<div className={cx('info-action')}>
					<p>{chat?.name}</p>
					<span>
						<ChevronDownIcon />
					</span>
				</div>
				<span className={cx('info-details')}>
					<InfoCircleIcon />
				</span>
			</div>
			<div className={cx('messages')}>
				{messages?.length > 0 ? (
					messages.map((msg) => (
						<Message
							key={msg._id}
							direction={msg.user.username === chat.username ? 'left' : 'right'}
							content={msg.content}
							files={msg.attachments}
							onClick={handleMessage}
						/>
					))
				) : (
					<div className={cx('box-empty')}>
						<p>No messages yet</p>
					</div>
				)}
				<div ref={msgEndRef} />
			</div>
			<form className={cx('input')} onSubmit={handleSubmit}>
				{files.length > 0 && (
					<div className={cx('preview-attachments')}>
						{files.map((file) => (
							<div key={file.name} className={cx('file-container')}>
								{file.type.includes('image') ? (
									<img src={file.preview} alt={file.name} />
								) : (
									<video src={file.preview} alt={file.name} controls />
								)}
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
