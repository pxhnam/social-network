import HomePage from '~/pages/Home';
import AboutPage from '~/pages/About';
import ProfilePage from '~/pages/Profile';
import PostPage from '~/pages/Post';

const publicRoutes = [
	{ name: 'Home', path: '', component: HomePage },
	{ name: 'About', path: 'about', component: AboutPage },
	{ path: 'profile/:username', component: ProfilePage },
	{ path: 'posts/:id', component: PostPage },
];

const privateRoutes = [{ path: '', component: HomePage }];

export { publicRoutes, privateRoutes };
