import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { useState } from 'react';

const cls = classNames.bind(styles);

const ModalLayout = ({ children, state, setState }) => {
	const [isOverlayClick, setOverlayClick] = useState(false);

	const handleMouseDown = (e) => {
		if (e.target.classList.contains(cls('overlay'))) {
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
				className={cls('overlay')}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
			>
				<div className={cls('wrapper')} onClick={(e) => e.stopPropagation()}>
					{children}
				</div>
			</div>,
			document.body
		)
	);
};

export default ModalLayout;
