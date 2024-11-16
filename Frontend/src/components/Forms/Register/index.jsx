import { useState } from 'react';
import classNames from 'classnames/bind';
import userService from '~/services/UserService';
import styles from './styles.module.scss';
import { HideIcon, LockIcon, ShowIcon, UserIcon } from '~/components/Icons';
import toast from '~/components/custom-toast';

const cx = classNames.bind(styles);

const RegisterForm = ({ onBack }) => {
	const [isShow, setIsShow] = useState(false);
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (
				firstName.trim() &&
				lastName.trim() &&
				username.trim() &&
				password.trim()
			) {
				const response = await userService.register(
					firstName,
					lastName,
					username,
					password
				);
				setMessage('');
				if (response.status) {
					onBack();
					toast.success({ message: response.message });
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
					id='first_name'
					onChange={(e) => setFirstName(e.target.value)}
					placeholder=''
				/>
				<label htmlFor='first_name'>First Name</label>
			</div>
			<div className={cx('form-input')}>
				<span className={cx('icon-user')}>
					<UserIcon />
				</span>
				<input
					type='text'
					id='last_name'
					onChange={(e) => setLastName(e.target.value)}
					placeholder=''
				/>
				<label htmlFor='last_name'>Last Name</label>
			</div>
			<div className={cx('form-input')}>
				<span className={cx('icon-user')}>
					<UserIcon />
				</span>
				<input
					type='text'
					id='username'
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
					onChange={(e) => setPassword(e.target.value)}
					placeholder=''
				/>
				<label htmlFor='password'>Password</label>
				<span className={cx('icon-eye')} onClick={() => setIsShow(!isShow)}>
					{isShow ? <HideIcon /> : <ShowIcon />}
				</span>
			</div>
			<button
				type='submit'
				className={cx(
					'form-button',
					username.trim() &&
						password.trim() &&
						firstName.trim() &&
						lastName.trim()
						? ''
						: 'disabled'
				)}
			>
				Register
			</button>
		</form>
	);
};

export default RegisterForm;
