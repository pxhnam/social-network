import { createBrowserRouter } from 'react-router-dom';
import Layout from '~/layouts';
import AboutPage from '~/pages/About';
import HomePage from '~/pages/Home';
import ProfilePage from '~/pages/Profile';

const router = createBrowserRouter(
	[
		{
			path: '/',
			element: <Layout />,
			children: [
				{ path: '/', element: <HomePage /> },
				{ path: '/about', element: <AboutPage /> },
				{ path: '/profile/:username', element: <ProfilePage /> },
			],
			// errorElement: <ErrorPage />,
		},
	],
	{
		future: {
			v7_startTransition: true,
			v7_relativeSplatPath: true,
			v7_fetcherPersist: true,
			v7_normalizeFormMethod: true,
			v7_partialHydration: true,
			v7_skipActionErrorRevalidation: true,
		},
	}
);
export default router;
