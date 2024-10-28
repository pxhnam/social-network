const response = {
	success: (message, data = null) => {
		return {
			status: true,
			...(message && { message }),
			...(data && Object.keys(data).length > 0 && { data }),
		};
	},
	error: (message, data = null) => {
		return {
			status: false,
			...(message && { message }),
			...(data && Object.keys(data).length > 0 && { data }),
		};
	},
};

export default response;
