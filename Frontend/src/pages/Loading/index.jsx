import classNames from 'classnames/bind';
import styles from './styles.module.scss';

const cx = classNames.bind(styles);

const LoadingPage = () => {
	return (
		<div className={cx('wrapper')}>
			<span className={cx('loader')}></span>
		</div>
	);
};

export default LoadingPage;
