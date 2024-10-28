import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '~/context/AuthProvider';

const ProtectedRoute = ({ children, loginPath = '/login' }) => {
	const { auth } = useContext(AuthContext);

	return auth ? children : <Navigate to={loginPath} replace />;
};

export default ProtectedRoute;
