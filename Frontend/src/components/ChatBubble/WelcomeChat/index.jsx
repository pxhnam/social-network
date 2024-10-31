import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { LaptopIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

const WelcomeChat = () => {
	return (
		<div className={cx('welcome')}>
			<LaptopIcon />
			<p>Welcome to Lor Chat</p>
			<span>Start replying to messages now!</span>
		</div>
	);
};

export default WelcomeChat;
