import classNames from 'classnames/bind';
import axios from 'axios';
import ReactDOM from 'react-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '~/context/AuthProvider';

import styles from './loading.module.scss';

const cx = classNames.bind(styles);

const Loading = () => {
	const { setAuth, setOpenAuthForm } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);

	axios.interceptors.request.use(
		(config) => {
			setLoading(true);
			return config;
		},
		(error) => {
			setLoading(false);
			return Promise.reject(error);
		}
	);

	axios.interceptors.response.use(
		(response) => {
			setLoading(false);
			return response;
		},
		(error) => {
			if (error.response && error.response.status === 401) {
				setAuth(null);
				setOpenAuthForm(true);
				return;
			}
			// console.log(401);
			setLoading(false);
			return Promise.reject(error);
		}
	);
	return ReactDOM.createPortal(
		<div className={cx('loading-top', { show: loading })}></div>,
		document.body
	);
};

export default Loading;
