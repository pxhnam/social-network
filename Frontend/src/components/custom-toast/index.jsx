import React from 'react';
import { createRoot } from 'react-dom/client';
import classNames from 'classnames/bind';
import Toast from './Toast';
import styles from './styles.module.scss';

const cx = classNames.bind(styles);

const createToast = ({ type, title, message, duration = 3000 }) => {
	const toastContainer = document.createElement('div');
	toastContainer.className = cx('toast-container');
	document.body.appendChild(toastContainer);
	const root = createRoot(toastContainer);

	const handleClose = () => {
		if (document.body.contains(toastContainer)) {
			toastContainer.classList.add(cx('hide'));
			setTimeout(() => {
				root.unmount();
				if (document.body.contains(toastContainer))
					document.body.removeChild(toastContainer);
			}, 300);
		}
	};

	root.render(
		<Toast
			type={type}
			title={title}
			message={message}
			duration={duration}
			onClose={handleClose}
		/>
	);

	setTimeout(handleClose, duration);
};

const toast = {
	success: ({ title = 'Thành công', message, duration }) =>
		createToast({ type: 'success', title, message, duration }),
	error: ({ title = 'Lỗi', message, duration }) =>
		createToast({ type: 'error', title, message, duration }),
	info: ({ title = 'Thông báo', message, duration }) =>
		createToast({ type: 'info', title, message, duration }),
	warning: ({ title = 'Cảnh báo', message, duration }) =>
		createToast({ type: 'warning', title, message, duration }),
};

export default toast;
