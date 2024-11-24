import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { Toast } from '../UI';

const cx = classNames.bind(styles);

let create = null;

export const toast = {
	success: (title, message, duration) =>
		create && create('success', title, message, duration),
	error: (title, message, duration) =>
		create && create('error', title, message, duration),
	info: (title, message, duration) =>
		create && create('info', title, message, duration),
	warning: (title, message, duration) =>
		create && create('warning', title, message, duration),
};

const ToastContainer = () => {
	const [toasts, setToasts] = useState([]);

	create = (type, title, message, duration) => {
		const toast = {
			id: Date.now(),
			type,
			title,
			message,
			duration,
		};
		setToasts((toasts) => [...toasts, toast]);
	};

	const remove = (id) => {
		setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
	};

	return (
		<div className={cx('toast-container')}>
			{toasts.map((toast) => (
				<Toast
					key={toast.id}
					id={toast.id}
					type={toast.type}
					title={toast.title}
					message={toast.message}
					duration={toast.duration}
					onClose={() => remove(toast.id)}
				/>
			))}
		</div>
	);
};

export default ToastContainer;
