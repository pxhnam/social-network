import classNames from 'classnames/bind';
import styles from './styles.module.scss';

const cls = classNames.bind(styles);

const LoadingPage = () => {
	return (
		<div className={cls('wrapper')}>
			<span className={cls('loader')}></span>
		</div>
	);
};

export default LoadingPage;
