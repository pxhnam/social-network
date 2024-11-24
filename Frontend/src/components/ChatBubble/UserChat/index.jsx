import { memo } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import { ChevronDownIcon } from '~/components/Icons';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const UserChat = ({
	avatar,
	name,
	content,
	time,
	active,
	online,
	onClick,
	onAction,
}) => {
	const navigate = useNavigate();
	return (
		<div className={cx('wrapper', { active })} onClick={onClick}>
			<div className={cx('box-avatar', { online })}>
				<img src={avatar} alt='avatar' />
			</div>
			<div className={cx('details')}>
				<div className={cx('name-time')}>
					<p className={cx('name')}>{name}</p>
					<span className={cx('time')}>{time}</span>
				</div>
				<div className={cx('msg')}>
					<p className={cx('text')}>{content}</p>
					<span className={cx('icon-action')} onClick={onAction}>
						<ChevronDownIcon />
					</span>
				</div>
			</div>
		</div>
	);
};

UserChat.propTypes = {
	avatar: PropTypes.string,
	name: PropTypes.string,
	content: PropTypes.string,
	time: PropTypes.string,
	active: PropTypes.bool,
	online: PropTypes.bool,
	onClick: PropTypes.func,
	onAction: PropTypes.func,
};

export default memo(UserChat);
