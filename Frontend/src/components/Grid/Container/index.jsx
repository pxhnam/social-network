import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

const Container = ({ className, style, children }) => {
	return (
		<div className={classNames(cx('container'), className)} style={style}>
			{children}
		</div>
	);
};

Container.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object,
	children: PropTypes.node.isRequired,
};

export default Container;
