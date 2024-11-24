import { useEffect } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

const cx = classNames.bind(styles);

const Toast = ({
	id,
	type,
	title = '',
	message = '',
	duration = 3000,
	onClose,
}) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose(id);
		}, duration);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className={cx('toast', 'toast-' + type)}>
			{type && (
				<div className={cx('toast-icon')}>
					<div className={cx('icon')}></div>
				</div>
			)}
			<div className={cx('toast-message')}>
				<h4>{title}</h4>
				<p>{message}</p>
			</div>
			<button className={cx('toast-close')} onClick={onClose}></button>
		</div>
	);
};

Toast.propTypes = {
	id: PropTypes.number.isRequired,
	type: PropTypes.oneOf(['info', 'success', 'error', 'warning']).isRequired,
	title: PropTypes.string,
	message: PropTypes.string,
	duration: PropTypes.number,
	onClose: PropTypes.func,
};

export default Toast;
