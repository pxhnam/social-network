import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { useState } from 'react';

const cx = classNames.bind(styles);

const ModalLayout = ({ children, state, setState }) => {
	const [isOverlayClick, setOverlayClick] = useState(false);

	const handleMouseDown = (e) => {
		if (e.target.classList.contains(cx('overlay'))) {
			setOverlayClick(true);
		} else {
			setOverlayClick(false);
		}
	};

	const handleMouseUp = () => {
		isOverlayClick && setState(false);
	};

	return (
		state &&
		ReactDOM.createPortal(
			<div
				className={cx('overlay')}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
			>
				<div className={cx('wrapper')} onClick={(e) => e.stopPropagation()}>
					{children}
				</div>
			</div>,
			document.body
		)
	);
};

export default ModalLayout;
