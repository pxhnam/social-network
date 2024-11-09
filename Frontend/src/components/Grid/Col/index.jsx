import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

const Col = ({ xs, sm, md, lg, xl, xxl, className, style, children }) => {
	const generateClass = (base, prefix = '', value = '') => {
		let modifier = base;
		if (prefix) modifier += `-${prefix}`;
		if (value) modifier += `-${value}`;
		return modifier;
	};

	const createColClass = (value, prefix = '') => {
		switch (typeof value) {
			case 'boolean':
				return generateClass('col', prefix);
			case 'number':
			case 'string':
				return generateClass('col', prefix, value);
			case 'object':
				const { size, offset } = value;
				const classes = [];
				if (size !== undefined)
					classes.push(generateClass('col', prefix, size));
				if (offset !== undefined)
					classes.push(generateClass('offset', prefix, offset));
				return classes;
			default:
				return '';
		}
	};

	const colClasses = cx(
		createColClass(xs),
		createColClass(sm, 'sm'),
		createColClass(md, 'md'),
		createColClass(lg, 'lg'),
		createColClass(xl, 'xl'),
		createColClass(xxl, 'xxl')
	);

	return (
		<div
			className={classNames(colClasses || cx('col'), className)}
			style={style}
		>
			{children}
		</div>
	);
};

Col.propTypes = {
	xs: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
		PropTypes.bool,
		PropTypes.shape({
			size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
			offset: PropTypes.number,
		}),
	]),
	sm: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
		PropTypes.bool,
		PropTypes.shape({
			size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
			offset: PropTypes.number,
		}),
	]),
	md: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
		PropTypes.bool,
		PropTypes.shape({
			size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
			offset: PropTypes.number,
		}),
	]),
	lg: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
		PropTypes.bool,
		PropTypes.shape({
			size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
			offset: PropTypes.number,
		}),
	]),
	xl: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
		PropTypes.bool,
		PropTypes.shape({
			size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
			offset: PropTypes.number,
		}),
	]),
	xxl: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
		PropTypes.bool,
		PropTypes.shape({
			size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
			offset: PropTypes.number,
		}),
	]),
	className: PropTypes.string,
	style: PropTypes.object,
	children: PropTypes.node.isRequired,
};

export default Col;
