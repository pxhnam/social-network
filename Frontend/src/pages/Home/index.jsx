import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import Post from '~/components/Post';
import { useAuth } from '~/context/AuthProvider';
import CreatePost from '~/components/CreatePost';
import postService from '~/services/PostService';
import { Row, Col } from '~/components/Grid';

const cx = classNames.bind(styles);

const HomePage = () => {
	const LIMIT = 10;
	const { auth } = useAuth();
	const [loading, setLoading] = useState(false);
	const [posts, setPosts] = useState([]);
	const { ref, inView } = useInView();

	const loadData = async (total, limit) => {
		try {
			const response = await postService.get(total, limit);
			return response?.data ?? [];
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (!inView || loading) return;
		(async () => {
			try {
				setLoading(true);
				const newData = await loadData(posts.length, LIMIT);
				setPosts((oldData) => [...oldData, ...newData]);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		})();
	}, [inView]);

	return (
		<Row className='d-flex flex-column align-items-center gap-3 pt-3'>
			{auth && (
				<Col xxl='5' xl='6' lg='7' md='9' xs='12'>
					<CreatePost avatar={auth.avatar} />
				</Col>
			)}
			{posts.map((post) => (
				<Col xxl='5' xl='6' lg='7' md='9' xs='12' key={post._id}>
					<Post props={post} />
				</Col>
			))}
			<span ref={ref}></span>
			{loading && (
				<div className={cx('box-loader')}>
					<span className={cx('loader')}></span>
				</div>
			)}
		</Row>
	);
};

export default HomePage;
