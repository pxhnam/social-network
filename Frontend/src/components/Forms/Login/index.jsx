import { useContext, useState } from 'react';
import classNames from 'classnames/bind';
import toast from 'react-hot-toast';
import userService from '~/services/UserService';
import { AuthContext } from '~/context/AuthProvider';
import styles from './styles.module.scss';
import { HideIcon, LockIcon, ShowIcon, UserIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

const LoginForm = () => {
	const { setAuth, setOpenAuthForm } = useContext(AuthContext);
	const [isShow, setIsShow] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (username.trim() && password.trim()) {
				const response = await userService.login(username, password);
				if (response.status) {
					setAuth(response.data);
					setMessage('');
					setOpenAuthForm(false);
					toast.success(response.message);
				} else {
					setMessage(response.message);
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<form
			className={cx('form')}
			action=''
			autoComplete='off'
			onSubmit={handleSubmit}
		>
			{message && <p className={cx('text-danger')}>{message}</p>}
			<div className={cx('form-input')}>
				<span className={cx('icon-user')}>
					<UserIcon />
				</span>
				<input
					type='text'
					id='username'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder=''
				/>
				<label htmlFor='username'>Username</label>
			</div>
			<div className={cx('form-input')}>
				<span className={cx('icon-lock')}>
					<LockIcon />
				</span>
				<input
					type={isShow ? 'text' : 'password'}
					id='password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder=''
				/>
				<label htmlFor='password'>Password</label>
				<span className={cx('icon-eye')} onClick={() => setIsShow(!isShow)}>
					{isShow ? <HideIcon /> : <ShowIcon />}
				</span>
			</div>
			<div className={cx('form-others')}>
				<div className={cx('form-others__remember')}>
					<input type='checkbox' id='remember' />
					<label htmlFor='remember'>Remember me</label>
				</div>
				<a href='#'>Forgot password?</a>
			</div>
			<button
				type='submit'
				className={cx(
					'form-button',
					username.trim() && password.trim() ? '' : 'disabled'
				)}
			>
				Login
			</button>
		</form>
	);
};

export default LoginForm;
