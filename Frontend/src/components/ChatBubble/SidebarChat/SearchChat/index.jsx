import { memo } from 'react';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { SearchIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

const SearchChat = ({ onChange }) => {
	return (
		<div className={cx('form-search')}>
			<SearchIcon />
			<input type='text' placeholder='Search...' onChange={onChange} />
		</div>
	);
};

export default memo(SearchChat);
