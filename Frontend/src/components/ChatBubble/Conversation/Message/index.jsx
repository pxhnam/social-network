import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { EllipsisIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

const Message = ({ direction, content }) => {
	return (
		<div className={cx(direction)}>
			{direction === 'right' && (
				<span>
					<EllipsisIcon />
				</span>
			)}
			<p>{content}</p>
			{direction === 'left' && (
				<span>
					<EllipsisIcon />
				</span>
			)}
		</div>
	);
};

export default Message;
