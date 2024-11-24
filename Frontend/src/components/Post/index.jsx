import { useEffect, useRef, useState, memo } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import { useAuth } from '~/context/AuthProvider';
import postService from '~/services/PostService';
import commentService from '~/services/CommentService';
import styles from './styles.module.scss';
import {
	ShareIcon,
	EllipsisIcon,
	CommentIcon,
	SendIcon,
	CloseIcon,
} from '../Icons';
import Comment from '../Comment';
import MediaSlider from '../MediaSlider';
import DropdownMenu from '../DropdownMenu';
import { toast } from '../ToastContainer';

const cx = classNames.bind(styles);

const Post = ({ props }) => {
	const LIMIT = 10;
	const { auth, socket } = useAuth();
	const [init, setInit] = useState(true);
	const [post, setPost] = useState(props || []);
	const [tempFiles, setTempFiles] = useState([]);
	const [isFloating, setIsFloating] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isComment, setIsComment] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isOverlayClick, setOverlayClick] = useState(false);
	const [isHovered, setHovered] = useState(false);
	const [comments, setComments] = useState([]);
	const [newStatus, setNewStatus] = useState('');
	const [isEditing, setIsEditing] = useState(false);
	const [commentCount, setCommentCount] = useState(0);
	// const [shareCount, setShareCount] = useState(0);
	const [comment, setComment] = useState('');
	const inputCommentRef = useRef(null);
	const menuPostRef = useRef(null);

	const loadComments = async (id, total, limit) => {
		try {
			const response = await commentService.get(id, total, limit);
			return response?.status ? response?.data : [];
		} catch (error) {
			console.log(error);
		}
	};

	const countComments = async () => {
		try {
			const response = await commentService.count(post._id);
			if (response.status) {
				const { count } = response.data;
				setCommentCount(count);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		(async () => {
			const data = await loadComments(post._id, comments?.length || 0, LIMIT);
			setComments(data);
		})();
		countComments();
	}, []);

	useEffect(() => {
		if (isComment && inputCommentRef.current) {
			inputCommentRef.current.focus();
		}
	}, [isComment]);

	useEffect(() => {
		if (socket) {
			socket.on('onUpdateLikes', ({ _id, count }) => {
				if (post._id === _id) {
					setPost((prevPost) => ({
						...prevPost,
						likeCount: count,
					}));
				}
			});
			socket.on('updateComment', ({ postId, ...cmt }) => {
				if (postId === post._id) {
					setComments((oldData) =>
						Array.isArray(oldData) ? [...oldData, cmt] : [cmt]
					);
				}
			});
		}
		return () => {
			if (socket) {
				socket.off('onUpdateLikes');
				socket.off('updateComment');
			}
		};
	}, [socket]);

	const handleOpenComment = () => {
		setIsComment(!isComment);
	};

	const onComment = async () => {
		try {
			const response = await commentService.create(post._id, comment, []);
			if (response.status) {
				setComment('');
				const data = {
					...response?.data,
					avatar: auth.avatar,
					username: auth.username,
					name: auth.name,
				};
				socket.emit('newComment', data);
				countComments();
			}
		} catch (error) {
			console.log(error);
		}
		inputCommentRef.current.focus();
	};

	const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			onComment();
		}
	};

	const handleMoreComments = async () => {
		if (!isFloating) {
			setIsFloating(true);
			setIsComment(true);
		} else {
			try {
				setIsLoading(true);
				const data = await loadComments(post._id, comments.length, LIMIT);
				setComments((oldData) => [...data, ...oldData]);
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		}
	};

	const handleMouseDown = (e) => {
		if (e.target.classList.contains(cx('overlay'))) {
			setOverlayClick(true);
		} else {
			setOverlayClick(false);
		}
	};

	const handleMouseUp = () => {
		isOverlayClick && setIsFloating(false);
	};

	const toggleLike = async () => {
		try {
			const response = await postService.toggleLike(post._id);
			if (response?.status) {
				let count = post.likeCount;
				if (post.isLiked) {
					count = count > 0 ? count - 1 : 0;
				} else {
					count += 1;
				}
				socket.emit('onToggleLike', {
					_id: post._id,
					count,
				});
				setPost((prevPost) => ({
					...prevPost,
					isLiked: !prevPost.isLiked,
				}));
			}
		} catch (error) {
			console.log(error);
		}
	};

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};

	const onCancelEdit = () => {
		setIsEditing(false);
		setNewStatus('');
		console.log(tempFiles);
	};

	const onSaveEdit = async () => {
		try {
			const formData = new FormData();
			formData.append('id', post._id);
			formData.append('content', newStatus);
			const _files = tempFiles
				.filter((file) => file.isDelete)
				.map((file) => file._id);
			formData.append('_files', JSON.stringify(_files));

			if (!newStatus.trim()) return;

			const { status, message } = await postService.update(formData);
			if (status) {
				toast.success(message);
				setIsEditing(false);
				setPost((data) => ({
					...data,
					attachments: data.attachments.filter(
						(att) => !_files.includes(att._id)
					),
				}));
			} else {
				toast.error(message);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleRemoveFile = async (id) => {
		try {
			setTempFiles((files) =>
				files.map((file) =>
					file._id === id ? { ...file, isDelete: true } : file
				)
			);
		} catch (error) {
			console.log(error);
		}
	};

	const menuPost = [
		{
			name: 'Edit',
			onClick: () => {
				setIsEditing(true);
				setIsDropdownOpen(false);
				setNewStatus(post.content);
				setTempFiles(
					post.attachments.map((attachment) => ({
						...attachment,
						isDelete: false,
					}))
				);
			},
		},
		{
			name: 'Delete',
			onClick: async () => {
				Swal.fire({
					title: 'Are you sure?',
					text: "You won't be able to revert this!",
					icon: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Yes, delete it!',
				}).then(async (result) => {
					if (result.isConfirmed) {
						try {
							const { status, message } = await postService.remove(post._id);
							setIsDropdownOpen(!status);
							if (status) {
								toast.success(message);
								setInit(false);
							} else {
								toast.error(message);
							}
						} catch (error) {
							console.log(error);
						}
					}
				});
			},
		},
	];

	useEffect(() => {
		if (isFloating) {
			document.body.style.overflow = isHovered ? 'hidden' : 'auto';
		}

		return () => {
			document.body.style.overflow = 'auto';
		};
	}, [isFloating, isHovered]);

	return (
		init && (
			<div
				className={cx({ overlay: isFloating })}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
			>
				<div
					className={cx('post', { modal: isFloating })}
					onClick={(e) => e.stopPropagation()}
					onMouseEnter={() => setHovered(true)}
					onMouseLeave={() => setHovered(false)}
				>
					{isFloating && (
						<div className={cx('modal-header')}>
							<span className={cx('title')}>{post.author.name}'s article</span>
							<span
								className={cx('btn-close')}
								onClick={() => setIsFloating(false)}
							>
								<CloseIcon />
							</span>
						</div>
					)}
					<div className={cx('post-info')}>
						<div className={cx('post-info__details')}>
							<img
								className={cx('info-avatar')}
								src={post.author.avatar}
								alt='avatar'
							/>
							<div className={cx('info-details')}>
								<Link
									to={'/profile/' + post.author.username}
									className={cx('info-details__name')}
								>
									{post.author.name}
								</Link>
								<span className={cx('info-details__time')}>
									{post.createdAt}
								</span>
							</div>
						</div>
						{auth?.username === post.author.username && (
							<div className={cx('post-info__action')} ref={menuPostRef}>
								<span onClick={toggleDropdown}>
									<EllipsisIcon />
								</span>
								<DropdownMenu
									state={isDropdownOpen}
									setState={setIsDropdownOpen}
									menu={menuPost}
									reference={menuPostRef}
								/>
							</div>
						)}
					</div>
					<div className={cx('post-content')}>
						{isEditing ? (
							<div className={cx('post-content__edit')}>
								<textarea
									defaultValue={newStatus}
									className={cx('form-edit')}
									placeholder='Editing status'
									onChange={(e) => {
										setNewStatus(e.target.value);
									}}
								></textarea>
								<div className={cx('form-media')}>
									{tempFiles.map(
										(file) =>
											!file.isDelete && (
												<div className={cx('form-media__file')} key={file._id}>
													<span
														className={cx('close-icon')}
														onClick={() => handleRemoveFile(file._id)}
													>
														<CloseIcon />
													</span>
													{file.type === 'image' ? (
														<img src={file.url} alt='avatar-edit' />
													) : (
														<video src={file.url} controls />
													)}
												</div>
											)
									)}
								</div>
								<div className={cx('form-action')}>
									<button className={cx('btn-cancel')} onClick={onCancelEdit}>
										Cancel
									</button>
									<button className={cx('btn-save')} onClick={onSaveEdit}>
										Save
									</button>
								</div>
							</div>
						) : (
							<p className={cx('post-content__article')}>{post.content}</p>
						)}
						{post.attachments?.length > 0 && (
							<div className={cx('post-content__media')}>
								<MediaSlider attachments={post.attachments} />
							</div>
						)}
					</div>
					<div className={cx('post-actions')}>
						<div
							className={cx('post-actions__reaction', {
								active: post.isLiked,
							})}
							onClick={toggleLike}
						>
							<span className={cx('heart-icon')}>
								{post.isLiked ? (
									<svg
										xmlns='http://www.w3.org/2000/svg'
										style={{ width: '23px', height: '23px' }}
										width='24'
										height='24'
										viewBox='0 0 24 24'
										fill='currentColor'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									>
										<path d='M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572' />
									</svg>
								) : (
									<svg
										xmlns='http://www.w3.org/2000/svg'
										style={{ width: '23px', height: '23px' }}
										width='24'
										height='24'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									>
										<path d='M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572' />
									</svg>
								)}
							</span>

							{post.likeCount > 0 && (
								<span className={cx('count-like')}>{post.likeCount}</span>
							)}
						</div>
						<div
							className={cx('post-actions__reaction')}
							onClick={handleOpenComment}
						>
							<span>
								<CommentIcon width='23px' height='23px' />
							</span>
							{commentCount > 0 && (
								<span className={cx('count-comment')}>{commentCount}</span>
							)}
						</div>
						<div className={cx('post-actions__reaction')}>
							<span>
								<ShareIcon />
							</span>
						</div>
					</div>

					{comments?.length > 0 && <div className={cx('separator')}></div>}
					{comments?.length > 0 && (
						<div className={cx('box-comments')}>
							{comments?.length > 3 &&
								(!isFloating || comments?.length < commentCount) && (
									<div className={cx('more-comments')}>
										<span
											className={cx('btn-more')}
											onClick={handleMoreComments}
										>
											Xem thêm
										</span>
										{isLoading && <span className={cx('loader')}></span>}
									</div>
								)}

							{comments.slice(isFloating ? 0 : -3).map((comment) => (
								<Comment
									key={comment._id}
									props={{
										...comment,
										isAuthor: auth?.username === comment.username,
									}}
								/>
							))}
						</div>
					)}

					{auth && isComment && (
						<div className={cx('box-comment')}>
							<img src={auth.avatar} alt='avatar' className={cx('avatar')} />
							<input
								type='text'
								className={cx('input-comment')}
								placeholder='Write comment'
								ref={inputCommentRef}
								onKeyDown={handleKeyDown}
								value={comment}
								onChange={(e) => {
									setComment(e.target.value);
								}}
							/>
							<button className={cx('button-comment')} onClick={onComment}>
								<SendIcon />
							</button>
						</div>
					)}
				</div>
			</div>
		)
	);
};

Post.propTypes = {
	props: PropTypes.object,
};

export default memo(Post);
