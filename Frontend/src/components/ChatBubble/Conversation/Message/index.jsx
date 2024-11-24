import { memo } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import { EllipsisIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

const Message = ({ direction, content, files, onClick }) => {
	return (
		<div className={cx(direction)}>
			{direction === 'right' && (
				<span>
					<EllipsisIcon />
				</span>
			)}
			<div className={cx('message')}>
				<p>{content}</p>
				{files &&
					files.length > 0 &&
					files.map((file) =>
						file.type === 'image' ? (
							<img key={file._id} src={file.url} />
						) : (
							<video key={file._id} src={file.url} controls />
						)
					)}
			</div>
			{direction === 'left' && (
				<span onClick={onClick}>
					<EllipsisIcon />
				</span>
			)}
		</div>
	);
};

Message.propTypes = {
	direction: PropTypes.string,
	content: PropTypes.string,
	files: PropTypes.array,
	onClick: PropTypes.func,
};

export default memo(Message);
