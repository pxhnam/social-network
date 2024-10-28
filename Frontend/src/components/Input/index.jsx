import classNames from 'classnames/bind';
import styles from './styles.module.scss';

const cls = classNames.bind(styles);

const Input = ({
	label,
	type = 'text',
	value,
	dark,
	light,
	error,
	msg,
	onChange,
	onKeyDown,
	autoFocus,
}) => {
	const classes = cls('form-input', {
		dark,
		light,
		error,
	});
	return (
		<div className={classes}>
			<input
				type={type}
				id={label}
				value={value}
				onChange={onChange}
				onKeyDown={onKeyDown}
				autoFocus={autoFocus}
				required
			/>
			<label htmlFor={label}>{label}</label>
			{error && <span>{msg}</span>}
		</div>
	);
};

export default Input;
