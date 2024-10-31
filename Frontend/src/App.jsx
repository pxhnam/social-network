import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Fragment } from 'react';
import { Toaster } from 'react-hot-toast';
import { publicRoutes, privateRoutes } from '~/routes';
import AuthForm from './components/Forms/Auth';
import Layouts from '~/layouts';
import Loading from '~/components/Loading';

import '~/App.scss';
import ChatBubble from './components/ChatBubble';
import ChatProvider from './context/ChatProvider';

const App = () => {
	return (
		<>
			<BrowserRouter>
				<Loading />
				<Routes>
					{/* Client Routes Group */}
					{publicRoutes.map((route, index) => {
						var Layout = Layouts;
						if (route.layout === false) {
							Layout = Fragment;
						}
						const Page = route.component;
						return (
							<Route
								key={index}
								path={route.path}
								element={
									<Layout>
										<Page />
									</Layout>
								}
							/>
						);
					})}

					{/* Admin Routes Group */}
					<Route path='/admin'>
						{privateRoutes.map((route, index) => {
							const Page = route.component;
							return <Route key={index} path={route.path} element={<Page />} />;
						})}
					</Route>

					<Route
						path='*'
						element={
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									height: '100vh',
									flexDirection: 'column',
									textAlign: 'center',
								}}
							>
								<h3>404 NOT FOUND</h3>
							</div>
						}
					/>
				</Routes>
				<ChatProvider>
					<ChatBubble />
				</ChatProvider>
			</BrowserRouter>
			<AuthForm />
			<Toaster position='top-center' reverseOrder={true} />
		</>
	);
};

export default App;
