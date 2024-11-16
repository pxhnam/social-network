import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

const Toast = ({
	type,
	title = '',
	message = '',
	duration = 3000,
	onClose,
}) => {
	return (
		<div className={cx('toast', 'toast-' + type)}>
			<div className={cx('toast-icon')}>
				<div className={cx('icon')}></div>
			</div>
			<div className={cx('toast-message')}>
				<h4>{title}</h4>
				<p>{message}</p>
			</div>
			<button className={cx('toast-close')} onClick={onClose}></button>
			<div className={cx('toast-timer')}>
				<div className={cx('toast-timer__animation')}></div>
			</div>
		</div>
	);
};

Toast.propTypes = {
	type: PropTypes.string,
	title: PropTypes.string,
	message: PropTypes.string,
	duration: PropTypes.number,
	// onClose: PropTypes.,
};

export default Toast;
