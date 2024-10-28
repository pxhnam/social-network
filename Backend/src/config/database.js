import mongoose from 'mongoose';

const URI = process.env.MONGODB_URI;

const connect = async () => {
	await mongoose
		.connect(URI)
		.then(() => {
			console.log('Successfully connected to database!');
		})
		.catch((error) => {
			console.log('Failed to connect to database! ');
			console.log(error.message);
		});
};

export default { connect };
