import classNames from 'classnames/bind';
import styles from './styles.module.scss';

const cls = classNames.bind(styles);

const Button = ({
	text = '',
	onClick,
	onKeyDown,
	primary,
	dark,
	light,
	uppercase,
	disabled,
}) => {
	const classes = cls('button', {
		primary,
		dark,
		light,
		uppercase,
	});

	return (
		<button
			className={classes}
			onClick={onClick}
			onKeyDown={onKeyDown}
			disabled={disabled}
		>
			{text}
		</button>
	);
};

export default Button;