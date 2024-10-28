import HomePage from '~/pages/Home';
import AboutPage from '~/pages/About';
import ProfilePage from '~/pages/Profile';
import PostPage from '~/pages/Post';
import ChatPage from '~/pages/Chat';

const publicRoutes = [
	{ name: 'Home', path: '', component: HomePage },
	{ name: 'About', path: 'about', component: AboutPage },
	{ name: 'Chat', path: 'chats', component: ChatPage, auth: true },
	{ path: 'chats/:room', component: ChatPage, auth: true },
	{ path: 'profile/:username', component: ProfilePage },
	{ path: 'posts/:id', component: PostPage },
	{ path: 'secret', component: ProfilePage, auth: true },
];

const privateRoutes = [
	{ path: '', component: HomePage },
	{ path: 'about', component: AboutPage },
];

export { publicRoutes, privateRoutes };
