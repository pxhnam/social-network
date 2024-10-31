import { useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import { AuthContext } from '~/context/AuthProvider';
import styles from './styles.module.scss';
import { LoginForm, RegisterForm } from '..';
import { CloseIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

const AuthForm = () => {
	const { auth, isOpen, setOpenAuthForm } = useContext(AuthContext);
	const [isOverlayClick, setOverlayClick] = useState(false);
	const [isActive, setIsActive] = useState(false);

	const handleMouseDown = (e) => {
		if (e.target.classList.contains(cx('overlay'))) {
			setOverlayClick(true);
		} else {
			setOverlayClick(false);
		}
	};

	const handleMouseUp = () => {
		isOverlayClick && setOpenAuthForm(false);
	};

	return (
		!auth &&
		ReactDOM.createPortal(
			<div
				className={cx('overlay', { show: isOpen })}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
			>
				<div
					className={cx('wrapper', { active: isActive })}
					onClick={(e) => e.stopPropagation()}
				>
					<span className={cx('icon-close')}>
						<CloseIcon onClick={() => setOpenAuthForm(false)} />
					</span>
					<div className={cx('form', 'login')}>
						<h3 className={cx('form-title')}>Login</h3>
						{!isActive && <LoginForm />}
						<div className={cx('form-account')}>
							<p>Don't have an account?</p>
							<span
								className={cx('link')}
								onClick={(e) => {
									e.preventDefault();
									setIsActive(true);
								}}
							>
								Register now
							</span>
						</div>
					</div>
					<div className={cx('form', 'register')}>
						<h3 className={cx('form-title')}>Register</h3>
						{isActive && <RegisterForm onBack={() => setIsActive(false)} />}
						<div className={cx('form-account')}>
							<p>Already have an account?</p>
							<span
								className={cx('link')}
								onClick={(e) => {
									e.preventDefault();
									setIsActive(false);
								}}
							>
								Login now
							</span>
						</div>
					</div>
				</div>
			</div>,
			document.body
		)
	);
};

export default AuthForm;
