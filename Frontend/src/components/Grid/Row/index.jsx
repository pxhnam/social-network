import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

const Row = ({ className, style, children }) => {
	return (
		<div className={classNames(cx('row'), className)} style={style}>
			{children}
		</div>
	);
};
Row.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object,
	children: PropTypes.node.isRequired,
};
export default Row;
