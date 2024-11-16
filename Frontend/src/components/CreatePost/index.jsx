import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import postService from '~/services/PostService';
import { ImageIcon, SendIcon } from '../Icons';
import toast from '../custom-toast';

const cx = classNames.bind(styles);

const CreatePost = ({ avatar }) => {
	const [text, setText] = useState('');
	const [media, setMedia] = useState([]);
	const textareaRef = useRef(null);

	useEffect(() => {
		const textarea = textareaRef.current;
		textarea.style.height = 'auto';
		textarea.style.height = `${textarea.scrollHeight}px`;
	}, [text]);

	useEffect(() => {
		return () => {
			media.map((file) => {
				URL.revokeObjectURL(file.preview);
			});
		};
	}, [media]);

	const handlePreviewImages = (e) => {
		const files = Array.from(e.target.files);
		const previewImages = files.map((file) => {
			file.preview = URL.createObjectURL(file);
			return file;
		});
		e.target.value = null;
		setMedia(previewImages);
	};

	const submit = async () => {
		if (text.trim()) {
			try {
				const formData = new FormData();
				formData.append('content', text);
				media.map((file) => {
					formData.append('attachments', file);
				});
				const response = await postService.create(formData);

				if (response.status) {
					console.log(response);
					setText('');
					setMedia([]);
					toast.success({ message: response.message });
				}
			} catch (error) {
				toast.error({ message: 'Something went wrong!' });
			}
		} else {
			textareaRef.current.focus();
		}
	};

	return (
		<div className={cx('wrapper')}>
			<div className={cx('box-input')}>
				<img src={avatar} alt='' />
				<textarea
					ref={textareaRef}
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder='What do you thing?'
				></textarea>
			</div>
			{media.length > 0 && (
				<div className={cx('box-preview')}>
					{media.map((file) =>
						file.type.includes('image') ? (
							<img key={file.name} src={file.preview} alt={file.name} />
						) : (
							<video key={file.name} src={file.preview} controls />
						)
					)}
				</div>
			)}
			<div className={cx('box-action')}>
				<div className={cx('upload-images')}>
					<label htmlFor='input-images'>
						<ImageIcon />
					</label>
					<input
						type='file'
						id='input-images'
						className={cx('input-images')}
						accept='image/*,video/*'
						onChange={handlePreviewImages}
						multiple
					/>
				</div>
				<button onClick={submit}>
					<SendIcon />
				</button>
			</div>
		</div>
	);
};

export default CreatePost;
