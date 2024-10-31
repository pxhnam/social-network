import { useState, useContext, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import classNames from 'classnames/bind';
import userService from '~/services/UserService';
import { AuthContext } from '~/context/AuthProvider';
import { publicRoutes } from '~/routes';
import styles from './styles.module.scss';
import { ChevronDownIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

function Header() {
	const { auth, setAuth, setOpenAuthForm } = useContext(AuthContext);
	const [isShow, setIsShow] = useState(false);
	const menuRef = useRef();
	const navigate = useNavigate();
	const toggleMenuProfile = () => {
		setIsShow((is) => !is);
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setIsShow(false);
			}
		};

		if (isShow) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isShow]);

	const handleAuth = (e) => {
		if (!auth) {
			e.preventDefault();
			setOpenAuthForm(true);
		}
	};

	const handleLogout = async () => {
		try {
			const { status, message } = await userService.logout();
			if (status) {
				toast.success(message);
				setIsShow(false);
				setAuth(null);
				navigate('/');
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<header className={cx('header')}>
			<nav className={cx('nav')}>
				{/* Logo */}
				<div className={cx('nav-logo')}>
					<Link to='/'>LOR</Link>
				</div>
				{/* Navigation Links */}
				<ul className={cx('nav-links')}>
					{publicRoutes.map(
						(route, index) =>
							route.name && (
								<li className={cx('nav-links__item')} key={index}>
									<NavLink
										to={'/' + route.path}
										className={({ isActive }) => cx({ active: isActive })}
										onClick={route.auth ? handleAuth : undefined}
									>
										{route.name}
									</NavLink>
								</li>
							)
					)}
				</ul>
				{/* Navigation Links */}
				{auth ? (
					<div className={cx('nav-profile')} ref={menuRef}>
						<div
							className={cx('nav-profile__info')}
							onClick={toggleMenuProfile}
						>
							{auth.avatar && (
								<img src={auth.avatar} alt='avatar' className={cx('avatar')} />
							)}
							<span>{auth?.name || ''}</span>
							<ChevronDownIcon width='17px' height='17px' />
						</div>
						{isShow && (
							<ul className={cx('nav-profile__menu')}>
								<li>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 24 24'
										strokeWidth='1.5'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											d='M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
										/>
									</svg>
									My Profile
								</li>
								<li onClick={() => handleLogout()}>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 24 24'
										strokeWidth='1.5'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											d='M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9'
										/>
									</svg>
									Logout
								</li>
							</ul>
						)}
					</div>
				) : (
					<ul className={cx('nav-links')}>
						<li className={cx('nav-links__item')}>
							<NavLink
								to='/login'
								onClick={(e) => {
									e.preventDefault();
									setOpenAuthForm(true);
								}}
							>
								Login
							</NavLink>
						</li>
					</ul>
				)}
			</nav>
		</header>
	);
}

export default Header;
