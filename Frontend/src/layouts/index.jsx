import { Container } from '~/components/Grid';
import Header from './Header';
import { Outlet } from 'react-router-dom';
function Layout() {
	return (
		<>
			<Header />
			<Container>
				<Outlet />
			</Container>
		</>
	);
}

export default Layout;
