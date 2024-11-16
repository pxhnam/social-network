import toast from '~/components/custom-toast';
import Toast from '~/components/custom-toast/Toast';
import { Col, Row } from '~/components/Grid';

const AboutPage = () => {
	return (
		<Row style={{ fontSize: '21px', fontWeight: '600' }}>
			<h1>About Page</h1>
			<Col md='6'>Col-6</Col>
			<Col md='6' style={{ border: '1px solid #fff' }}>
				Col-6
			</Col>
			<Col>
				<button
					onClick={() => {
						toast.success({ message: 'Hoàn thành đăng ký' });
					}}
				>
					Success
				</button>
			</Col>
			<Col>
				<button
					onClick={() => {
						toast.info('hi');
					}}
				>
					Info
				</button>
			</Col>
			<Col>
				<button
					onClick={() => {
						toast.error('hi');
					}}
				>
					Error
				</button>
			</Col>
			<Col>
				<button
					onClick={() => {
						toast.warning('hi');
					}}
				>
					Warning
				</button>
			</Col>
		</Row>
	);
};

export default AboutPage;
