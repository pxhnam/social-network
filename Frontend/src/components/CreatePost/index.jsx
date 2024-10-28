import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import toast from 'react-hot-toast';
import styles from './styles.module.scss';
import postService from '~/services/PostService';
import { ImageIcon, SendIcon } from '../Icons';

const cls = classNames.bind(styles);

const CreatePost = ({ avatar }) => {
	const [text, setText] = useState('');
	const [images, setImages] = useState([]);
	const textareaRef = useRef(null);

	useEffect(() => {
		const textarea = textareaRef.current;
		textarea.style.height = 'auto';
		textarea.style.height = `${textarea.scrollHeight}px`;
	}, [text]);

	useEffect(() => {
		return () => {
			images.forEach((image) => {
				URL.revokeObjectURL(image.preview);
			});
		};
	}, [images]);

	const handlePreviewImages = (e) => {
		const files = Array.from(e.target.files);
		const previewImages = files.map((file) => {
			file.preview = URL.createObjectURL(file);
			return file;
		});
		e.target.value = null;
		setImages(previewImages);
	};

	const submit = async () => {
		if (text.trim()) {
			try {
				const formData = new FormData();
				formData.append('content', text);
				images.forEach((image) => {
					formData.append('attachments', image);
				});
				const response = await postService.create(formData);

				if (response.status) {
					console.log(response);
					setText('');
					setImages([]);
					toast.success(response.message);
				}
			} catch (error) {
				toast.error('Something went wrong!');
			}
		} else {
			textareaRef.current.focus();
		}
	};

	return (
		<div className={cls('wrapper')}>
			<div className={cls('box-input')}>
				<img src={avatar} alt='' />
				<textarea
					ref={textareaRef}
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder='What do you thing?'
				></textarea>
			</div>
			{images.length > 0 && (
				<div className={cls('box-preview')}>
					{images.map((image) => (
						<img key={image.name} src={image.preview} alt={image.name} />
					))}
				</div>
			)}
			<div className={cls('box-action')}>
				<div className={cls('upload-images')}>
					<label htmlFor='input-images'>
						<ImageIcon />
					</label>
					<input
						type='file'
						id='input-images'
						className={cls('input-images')}
						accept='image/*'
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
