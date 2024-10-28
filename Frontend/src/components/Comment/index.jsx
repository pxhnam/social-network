import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import commentService from '~/services/CommentService';
import styles from './styles.module.scss';
import { EllipsisIcon, HeartIcon } from '../Icons';
import DropdownMenu from '../DropdownMenu';

const cls = classNames.bind(styles);

const Comment = ({ id, avatar, username, name, content, time, isAuthor }) => {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef(null);
	const menu = [
		{
			name: 'Edit',
			onClick: () => {
				console.log(id);
			},
		},
		{
			name: 'Delete',
			onClick: async () => {
				try {
					const response = await commentService.remove(id);
					console.log(response);
					if (response?.status) {
						setIsOpen(false);
					}
				} catch (error) {
					console.log(error);
				}
			},
		},
	];

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};
	return (
		<div className={cls('comment')}>
			<img src={avatar} alt='avatar' className={cls('comment-avatar')} />
			<div className={cls('comment-info')}>
				<div className={cls('comment-info__user')}>
					<Link to={'/profile/' + username} className={cls('name')}>
						{name}
					</Link>

					{isAuthor && (
						<span
							className={cls('action')}
							ref={menuRef}
							onClick={toggleDropdown}
						>
							<EllipsisIcon />
						</span>
					)}
					<DropdownMenu
						state={isOpen}
						setState={setIsOpen}
						menu={menu}
						reference={menuRef}
					/>
				</div>
				<span className={cls('comment-info__content')}>{content}</span>
				<div className={cls('comment-info__others')}>
					<span className={cls('comment-time')}>{time}</span>
					<span className={cls('reply-content')}>Reply</span>
					<span className={cls('space')}></span>
					<span className={cls('heart-icon')}>
						<HeartIcon />
					</span>
				</div>
			</div>
		</div>
	);
};

export default Comment;
