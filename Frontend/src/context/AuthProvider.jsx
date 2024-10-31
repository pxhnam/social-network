import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import userService from '~/services/UserService';
import LoadingPage from '~/pages/Loading';

export const AuthContext = createContext();

const SOCKET_URL = 'http://localhost:5000';

const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState(null);
	const [socket, setSocket] = useState();
	const [isOpen, setOpenAuthForm] = useState(false);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	const validateToken = async () => {
		try {
			const { status, data } = await userService.profile();
			setAuth(status === true ? data : null);
		} catch (error) {
			setAuth(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		validateToken();
	}, []);

	useEffect(() => {
		const newSocket = io(SOCKET_URL);
		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
		};
	}, [auth]);

	useEffect(() => {
		if (socket && auth) {
			socket.emit('userConnect', auth?.username);
			socket.on('onlineUsers', (data) => setOnlineUsers(data));
		} else {
			setOnlineUsers([]);
		}

		return () => {
			socket && socket.off('onlineUsers');
		};
	}, [socket]);

	return (
		<AuthContext.Provider
			value={{ auth, setAuth, isOpen, setOpenAuthForm, socket, onlineUsers }}
		>
			{loading ? <LoadingPage></LoadingPage> : children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
