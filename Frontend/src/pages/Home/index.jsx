import { useContext, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import Post from '~/components/Post';
import { AuthContext } from '~/context/AuthProvider';
import CreatePost from '~/components/CreatePost';
import postService from '~/services/PostService';

const cls = classNames.bind(styles);

const HomePage = () => {
	const LIMIT = 10;
	const { auth, socket } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const [posts, setPosts] = useState([]);
	const { ref, inView } = useInView();

	useEffect(() => {
		socket.on('test', () => {
			console.log('test');
		});
		return () => {
			socket.off('test');
		};
	}, [socket]);

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
		<div className={cls('wrapper')}>
			{auth && <CreatePost avatar={auth.avatar} />}
			{posts.map((post) => (
				<Post key={post._id} object={post} />
			))}
			<span ref={ref}></span>
			{loading && (
				<div className={cls('box-loader')}>
					<span className={cls('loader')}></span>
				</div>
			)}
		</div>
	);
};

export default HomePage;
