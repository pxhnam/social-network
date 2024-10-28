import classNames from 'classnames/bind';
import axios from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '~/context/AuthProvider';

import styles from './loading.module.scss';

const cx = classNames.bind(styles);

const Loading = () => {
	const { setOpenAuthForm } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

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
				setOpenAuthForm(true);
				return;
			}
			setLoading(false);
			return Promise.reject(error);
		}
	);
	return <div className={cx('loading-top', { show: loading })}></div>;
};

export default Loading;
