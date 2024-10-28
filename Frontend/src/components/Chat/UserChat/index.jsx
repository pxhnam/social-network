import { memo } from 'react';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';

const cls = classNames.bind(styles);

const UserChat = ({ avatar, name, content, time, active, online, onClick }) => {
	return (
		<div
			className={cls('wrapper', { 'chat-active': active })}
			onClick={onClick}
		>
			<div className={cls('box-avatar')}>
				<img src={avatar} alt='avatar' className={cls('avatar')} />
				<span className={cls('status', online ? 'active' : 'inactive')}></span>
			</div>
			<div className={cls('box-info')}>
				<p className={cls('name')}>{name}</p>
				<div className={cls('box-content')}>
					<span className={cls('content')}>{content}</span>
					<span className={cls('separator')}></span>
					<span className={cls('time')}>{time}</span>
				</div>
			</div>
		</div>
	);
};

export default memo(UserChat);
