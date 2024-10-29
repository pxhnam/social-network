import { useState } from 'react';
import toast from 'react-hot-toast';
import classNames from 'classnames/bind';
import userService from '~/services/UserService';
import styles from './styles.module.scss';
import { HideIcon, LockIcon, ShowIcon, UserIcon } from '~/components/Icons';

const cls = classNames.bind(styles);

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
			className={cls('form')}
			action=''
			autoComplete='off'
			onSubmit={handleSubmit}
		>
			{message && <p className={cls('text-danger')}>{message}</p>}
			<div className={cls('form-input')}>
				<span className={cls('icon-user')}>
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
			<div className={cls('form-input')}>
				<span className={cls('icon-user')}>
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
			<div className={cls('form-input')}>
				<span className={cls('icon-user')}>
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
			<div className={cls('form-input')}>
				<span className={cls('icon-lock')}>
					<LockIcon />
				</span>
				<input
					type={isShow ? 'text' : 'password'}
					id='password'
					onChange={(e) => setPassword(e.target.value)}
					placeholder=''
				/>
				<label htmlFor='password'>Password</label>
				<span className={cls('icon-eye')} onClick={() => setIsShow(!isShow)}>
					{isShow ? <HideIcon /> : <ShowIcon />}
				</span>
			</div>
			<button
				type='submit'
				className={cls(
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
