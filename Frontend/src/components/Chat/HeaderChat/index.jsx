import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { InfoCircleIcon } from '~/components/Icons';

const cls = classNames.bind(styles);

const HeaderChat = ({ avatar, name, time = '', active }) => {
	return (
		<>
			<div className={cls('info')}>
				<div className={cls('box-avatar')}>
					<img src={avatar} alt='avatar' className={cls('avatar')} />
					<span
						className={cls('status', active ? 'active' : 'inactive')}
					></span>
				</div>
				<div>
					<p>{name}</p>
					<span>{active ? 'Đang hoạt động' : 'Đã hoạt động ' + time}</span>
				</div>
			</div>
			<span className={cls('action')}>
				<InfoCircleIcon />
			</span>
		</>
	);
};

export default HeaderChat;
