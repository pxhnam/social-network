import { Col, Row } from '~/components/Grid';

const AboutPage = () => {
	return (
		<Row style={{ fontSize: '21px', fontWeight: '600' }}>
			<h1>About Page</h1>
			<Col md='6'>Col-6</Col>
			<Col md='6' style={{ border: '1px solid #fff' }}>
				Col-6
			</Col>
			{/* <Col md='6'>Col-6</Col> */}
		</Row>
	);
};

export default AboutPage;
