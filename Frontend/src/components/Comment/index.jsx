import { useRef, useState, memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import commentService from '~/services/CommentService';
import styles from './styles.module.scss';
import { EllipsisIcon, HeartIcon } from '../Icons';
import DropdownMenu from '../DropdownMenu';
import { debounce } from '~/utils/debounce';

const cx = classNames.bind(styles);

const Comment = ({ props, onRemove }) => {
	const { _id, avatar, username, name, content, createdAt, isAuthor } = props;
	const [isRemoved, setIsRemoved] = useState(false);
	const [isShow, setShow] = useState(true);
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef(null);
	const menu = [
		{
			name: 'Edit',
			onClick: () => {
				console.log(_id);
			},
		},
		{
			name: 'Delete',
			onClick: async () => {
				try {
					const response = await commentService.remove(_id);
					if (response?.status) {
						setIsRemoved(true);
						setIsOpen(false);
					}
				} catch (error) {
					console.log(error);
				}
			},
		},
	];

	useEffect(
		debounce(() => {
			isRemoved && setShow(false);
		}, 300),
		[isRemoved]
	);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};
	return (
		isShow && (
			<div className={cx('comment', { removed: isRemoved })}>
				<img src={avatar} alt='avatar' className={cx('comment-avatar')} />
				<div className={cx('comment-info')}>
					<div className={cx('comment-info__user')}>
						<Link to={'/profile/' + username} className={cx('name')}>
							{name}
						</Link>

						{isAuthor && (
							<span
								className={cx('action')}
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
					<span className={cx('comment-info__content')}>{content}</span>
					<div className={cx('comment-info__others')}>
						<span className={cx('comment-time')}>{createdAt}</span>
						<span className={cx('reply-content')}>Reply</span>
						<span className={cx('space')}></span>
						<span className={cx('heart-icon')}>
							<HeartIcon />
						</span>
					</div>
				</div>
			</div>
		)
	);
};

Comment.propTypes = {
	props: PropTypes.object,
};

export default memo(Comment);
