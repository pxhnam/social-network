import { useContext, useEffect, useRef, useState, memo } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '~/context/AuthProvider';
import styles from './styles.module.scss';
import postService from '~/services/PostService';
import commentService from '~/services/CommentService';
import {
	ShareIcon,
	EllipsisIcon,
	CommentIcon,
	SendIcon,
	CloseIcon,
} from '../Icons';
import Comment from '../Comment';
import ImagePreview from '../ImagePreview';
import DropdownMenu from '../DropdownMenu';
import toast from 'react-hot-toast';

const cls = classNames.bind(styles);

const Post = ({ object }) => {
	const LIMIT = 10;
	const { auth, socket } = useContext(AuthContext);
	const [post, setPost] = useState(object ?? []);
	const [isFloating, setIsFloating] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isComment, setIsComment] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isOverlayClick, setOverlayClick] = useState(false);
	const [comments, setComments] = useState([]);
	const [newStatus, setNewStatus] = useState('');
	const [isEditing, setIsEditing] = useState(false);
	const [commentCount, setCommentCount] = useState(0);
	const [shareCount, setShareCount] = useState(0);
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
					setComments((oldData) => [...oldData, cmt]);
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
		if (e.target.classList.contains(cls('overlay'))) {
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
	};

	const onSaveEdit = async () => {
		try {
			const formData = new FormData();
			formData.append('id', post._id);
			formData.append('content', newStatus);

			if (!newStatus.trim()) return;

			const { status, message } = await postService.update(formData);
			if (status) {
				toast.success(message);
				setIsEditing(false);
				setNewStatus('');
			} else {
				toast.error(message);
			}
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
							status ? toast.success(message) : toast.error(message);
						} catch (error) {
							console.log(error);
						}
					}
				});
			},
		},
	];

	return (
		<div
			className={cls({ overlay: isFloating })}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
		>
			<div
				className={cls('post', { modal: isFloating })}
				onClick={(e) => e.stopPropagation()}
			>
				{isFloating && (
					<div className={cls('modal-header')}>
						<span className={cls('title')}>{post.author.name}'s article</span>
						<span
							className={cls('btn-close')}
							onClick={() => setIsFloating(false)}
						>
							<CloseIcon />
						</span>
					</div>
				)}
				<div className={cls('post-info')}>
					<div className={cls('post-info__details')}>
						<img
							className={cls('info-avatar')}
							src={post.author.avatar}
							alt='avatar'
						/>
						<div className={cls('info-details')}>
							<Link
								to={'/profile/' + post.author.username}
								className={cls('info-details__name')}
							>
								{post.author.name}
							</Link>
							<span className={cls('info-details__time')}>
								{post.createdAt}
							</span>
						</div>
					</div>
					{post.isAuth && (
						<div className={cls('post-info__action')} ref={menuPostRef}>
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
				<div className={cls('post-content')}>
					{isEditing ? (
						<div className={cls('post-content__edit')}>
							<textarea
								defaultValue={newStatus}
								className={cls('form-edit')}
								placeholder='Editing status'
								onChange={(e) => {
									setNewStatus(e.target.value);
								}}
							></textarea>
							<div className={cls('form-action')}>
								<button className={cls('btn-cancel')} onClick={onCancelEdit}>
									Cancel
								</button>
								<button className={cls('btn-save')} onClick={onSaveEdit}>
									Save
								</button>
							</div>
						</div>
					) : (
						<p className={cls('post-content__article')}>{post.content}</p>
					)}
					{post.attachments?.length > 0 && (
						<div className={cls('post-content__media')}>
							<ImagePreview attachments={post.attachments} />
						</div>
					)}
				</div>
				<div className={cls('post-actions')}>
					<div
						className={cls('post-actions__reaction', { active: post.isLiked })}
						onClick={toggleLike}
					>
						<span className={cls('heart-icon')}>
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
							<span className={cls('count-like')}>{post.likeCount}</span>
						)}
					</div>
					<div
						className={cls('post-actions__reaction')}
						onClick={handleOpenComment}
					>
						<span>
							<CommentIcon width='23px' height='23px' />
						</span>
						{commentCount > 0 && (
							<span className={cls('count-comment')}>{commentCount}</span>
						)}
					</div>
					<div className={cls('post-actions__reaction')}>
						<span>
							<ShareIcon />
						</span>
					</div>
				</div>

				{comments?.length > 0 && <div className={cls('separator')}></div>}
				{comments?.length > 0 && (
					<div className={cls('box-comments')}>
						{comments?.length > 3 &&
							(!isFloating || comments?.length < commentCount) && (
								<div className={cls('more-comments')}>
									<span
										className={cls('btn-more')}
										onClick={handleMoreComments}
									>
										Xem thêm
									</span>
									{isLoading && <span className={cls('loader')}></span>}
								</div>
							)}

						{comments.slice(isFloating ? 0 : -3).map((comment) => (
							<Comment
								key={comment._id}
								id={comment._id}
								avatar={comment.avatar}
								username={comment.username}
								name={comment.name}
								content={comment.content}
								time={comment.createdAt}
								isAuthor={auth?.username === comment.username}
							/>
						))}
					</div>
				)}

				{auth && isComment && (
					<div className={cls('box-comment')}>
						<img src={auth.avatar} alt='avatar' className={cls('avatar')} />
						<input
							type='text'
							className={cls('input-comment')}
							placeholder='Write comment'
							ref={inputCommentRef}
							onKeyDown={handleKeyDown}
							value={comment}
							onChange={(e) => {
								setComment(e.target.value);
							}}
						/>
						<button className={cls('button-comment')} onClick={onComment}>
							<SendIcon />
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(Post);
