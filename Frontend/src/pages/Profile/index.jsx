import classNames from 'classnames/bind';
import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './styles.module.scss';
import { AuthContext } from '~/context/AuthProvider';
import userService from '~/services/UserService';
import postService from '~/services/PostService';
import chatService from '~/services/ChatService';
import CreatePost from '~/components/CreatePost';
import Post from '~/components/Post';

const cx = classNames.bind(styles);

const ProfilePage = () => {
	const { auth } = useContext(AuthContext);
	const { username } = useParams();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [posts, setPosts] = useState([]);
	const navigate = useNavigate();

	const getUser = async () => {
		try {
			const { status, data } = await userService.get(username);
			setUser(status ? data : null);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const getPosts = async () => {
		try {
			const { status, data } = await postService.auth(username);
			setPosts(status && data ? data : []);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getUser();
		getPosts();
	}, [username]);

	const onFollow = async () => {
		try {
			if (user.isFollowing) {
				await userService.unfollow(username);
			} else {
				await userService.follow(username);
			}
			getUser();
		} catch (error) {}
	};

	const onChat = async () => {
		try {
			const response = await chatService.private(username);
			if (response?.status) {
				navigate('/chats/' + response?.data?._id);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return loading ? null : user ? (
		<div className={cx('wrapper')}>
			<div className={cx('box-profile')}>
				<div className={cx('box-profile__cover')}></div>
				<div className={cx('box-profile__info')}>
					<img
						src={user?.avatar}
						alt='avatar'
						className={cx('profile-avatar')}
					/>
					<div className={cx('profile-identity')}>
						<p>{user.first_name + ' ' + user.last_name}</p>
						<span>{user.followerCount} followers</span>
					</div>
					<div className={cx('profile-action')}>
						{user.itsme || (
							<>
								<button className={cx('btn-follow')} onClick={onFollow}>
									{user.isFollowing ? 'Unfollow' : 'Follow'}
								</button>
								<button className={cx('btn-inbox')} onClick={onChat}>
									Inbox
								</button>
							</>
						)}
					</div>
				</div>
			</div>
			{user.itsme && <CreatePost avatar={auth.avatar} />}
			<div className={cx('posts')}>
				{posts && posts.length > 0 ? (
					posts.map((post) => <Post key={post._id} object={post} auth={auth} />)
				) : (
					<div>
						<p>Chưa có bài viết nào.</p>
					</div>
				)}
			</div>
		</div>
	) : (
		<div
			style={{
				marginTop: '20px',
				textAlign: 'center',
				marginTop: '50px',
			}}
		>
			<h1>User Does Not Exist.</h1>
		</div>
	);
};

export default ProfilePage;
