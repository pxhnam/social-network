import classNames from 'classnames/bind';
import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '~/context/AuthProvider';
import { ChatContext } from '~/context/ChatProvider';
import userService from '~/services/UserService';
import postService from '~/services/PostService';
import chatService from '~/services/ChatService';
import styles from './styles.module.scss';
import CreatePost from '~/components/CreatePost';
import Post from '~/components/Post';
import { Row, Col } from '~/components/Grid';

const cx = classNames.bind(styles);

const ProfilePage = () => {
	const { auth, onlineUsers } = useContext(AuthContext);
	const { setChat, chatList, setChatList, setOpenChat } =
		useContext(ChatContext);
	const { username } = useParams();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [posts, setPosts] = useState([]);
	// const navigate = useNavigate();

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

	const handleFollow = async () => {
		try {
			if (user.isFollowing) {
				await userService.unfollow(username);
			} else {
				await userService.follow(username);
			}
			getUser();
		} catch (error) {}
	};

	const handleChat = async () => {
		if (user?.chatId) {
			setChat(chatList.find((chat) => chat._id === user.chatId));
		} else {
			const userChat = {
				_id: null,
				avatar: user.avatar,
				name: user.first_name + ' ' + user.last_name,
				username: user.username,
				content: 'Chưa có tin nhắn nào',
				isOnline: onlineUsers.some(
					(onlUser) => onlUser.username === user.username
				),
			};
			setChatList((list) => [userChat, ...list]);
			setChat(userChat);
		}
		setOpenChat(true);
	};

	return loading ? null : user ? (
		<Row className='d-flex flex-column align-items-center gap-3 pt-1'>
			{/* <div className={cx('wrapper')}> */}
			<Col xl='8' lg='10' xs='12'>
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
									<button className={cx('btn-follow')} onClick={handleFollow}>
										{user.isFollowing ? 'Unfollow' : 'Follow'}
									</button>
									{auth && (
										<button className={cx('btn-inbox')} onClick={handleChat}>
											Inbox
										</button>
									)}
								</>
							)}
						</div>
					</div>
				</div>
			</Col>
			{user.itsme && (
				<Col xxl='5' xl='6' lg='7' md='9' xs='12'>
					<CreatePost avatar={auth.avatar} />
				</Col>
			)}
			<Col xxl='5' xl='6' lg='7' md='9' xs='12'>
				<div className={cx('posts')}>
					{posts && posts.length > 0 ? (
						posts.map((post) => (
							<Post key={post._id} object={post} auth={auth} />
						))
					) : (
						<div>
							<p>Chưa có bài viết nào.</p>
						</div>
					)}
				</div>
			</Col>
			{/* </div> */}
		</Row>
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
