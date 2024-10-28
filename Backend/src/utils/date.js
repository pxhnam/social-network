export const timeCount = (dateString) => {
	const date = new Date(dateString);
	const now = new Date();
	const seconds = Math.floor((now - date) / 1000);

	let interval = Math.floor(seconds / 31536000);
	if (interval >= 1) {
		return date.toLocaleString();
	}

	interval = Math.floor(seconds / 2592000);
	if (interval >= 1) return interval + ' tháng trước';

	interval = Math.floor(seconds / 86400);
	if (interval >= 1) return interval + ' ngày trước';

	interval = Math.floor(seconds / 3600);
	if (interval >= 1) return interval + ' giờ trước';

	interval = Math.floor(seconds / 60);
	if (interval >= 1) return interval + ' phút trước';

	return 'vài giây trước';
};
