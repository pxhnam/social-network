import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';

const cx = classNames.bind(styles);

const DropdownMenu = ({ state, setState, reference, menu = [] }) => {
	const [style, setStyle] = useState({});
	const dropdownRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				reference.current &&
				!reference.current.contains(event.target) &&
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setState(false);
			}
		};

		if (state) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [state]);

	useEffect(() => {
		if (reference.current && state) {
			const { bottom, left } = reference.current.getBoundingClientRect();
			setStyle({
				position: 'absolute',
				top: bottom + window.scrollY,
				left: left,
			});
		}
	}, [reference, state]);

	return state && menu.length > 0
		? ReactDOM.createPortal(
				<div className={cx('wrapper')} style={style} ref={dropdownRef}>
					<ul className={cx({ open: state })}>
						{menu.map((item, index) => (
							<li key={index} onClick={item.onClick}>
								{item.name}
							</li>
						))}
					</ul>
				</div>,
				document.body
		  )
		: null;
};

export default DropdownMenu;
