import classNames from 'classnames/bind';
import styles from './styles.module.scss';

const cls = classNames.bind(styles);

const MyMessage = ({ content, time }) => {
	return (
		<div className={cls('wrapper')}>
			<span className={cls('content')}>{content}</span>
		</div>
	);
};

export default MyMessage;
