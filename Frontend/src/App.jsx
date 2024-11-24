import { RouterProvider } from 'react-router-dom';
import AuthForm from './components/Forms/Auth';
import Loading from '~/components/Loading';
import '~/assets/styles/utilities.scss';
import '~/assets/styles/main.scss';
import ChatBubble from './components/ChatBubble';
import ToastContainer from './components/ToastContainer';
import router from './routes';

const App = () => {
	return (
		<>
			<Loading />
			<RouterProvider
				future={{
					v7_startTransition: true,
				}}
				router={router}
			>
				<ChatBubble />
			</RouterProvider>
			<AuthForm />
			<ToastContainer />
		</>
	);
};

export default App;
