import { Container } from '~/components/Grid';
import Header from './Header';
function Layout({ children }) {
	return (
		<>
			<Header />
			{/* <div className='container'>{children}</div> */}
			<Container>{children}</Container>
		</>
	);
}

export default Layout;
