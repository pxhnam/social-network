import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { EllipsisIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

const Message = ({ direction, content, files }) => {
	return (
		<div className={cx(direction)}>
			{direction === 'right' && (
				<span>
					<EllipsisIcon />
				</span>
			)}
			<p>
				{content}
				{files &&
					files.length > 0 &&
					files.map((file) => <img key={file._id} src={file.url} />)}
			</p>
			{direction === 'left' && (
				<span>
					<EllipsisIcon />
				</span>
			)}
		</div>
	);
};

export default Message;
