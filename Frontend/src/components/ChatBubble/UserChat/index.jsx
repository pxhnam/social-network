import { memo } from 'react';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { ChevronDownIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

const UserChat = ({ avatar, name, content, time, active, online, onClick }) => {
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
					<span className={cx('icon-action')}>
						<ChevronDownIcon />
					</span>
				</div>
			</div>
		</div>
	);
};

export default memo(UserChat);
