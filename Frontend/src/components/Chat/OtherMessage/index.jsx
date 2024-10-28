import classNames from 'classnames/bind';
import styles from './styles.module.scss';

const cls = classNames.bind(styles);

const OtherMessage = ({ avatar, name, content, time }) => {
	return (
		<div className={cls('wrapper')}>
			<img src={avatar} alt='avatar' className={cls('avatar')} />
			<p className={cls('name')}>{name}</p>
			<span className={cls('content')}>{content}</span>
		</div>
	);
};

export default OtherMessage;
