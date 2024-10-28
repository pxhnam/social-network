import { Server } from 'socket.io';

const io = new Server(5000, {
	cors: ['http://localhost:8080/', 'http://127.0.0.1:8080/'],
	credentials: true,
});

let onlineUsers = [];

io.on('connection', (socket) => {
	socket.on('userConnect', (username) => {
		if (!onlineUsers.some((user) => user.username === username)) {
			onlineUsers.push({
				username,
				socketId: socket.id,
			});
			// console.log(onlineUsers);
			io.emit('onlineUsers', onlineUsers);
		}
	});

	socket.on('onTest', (username) => {
		const user = onlineUsers.find((user) => user.username === username);
		if (user) {
			io.to(user.socketId).emit('test');
		}
	});

	socket.on('sendMessage', (data) => {
		const { members, ...resData } = data;
		onlineUsers.map(
			(user) =>
				members.includes(user.username) &&
				io.to(user.socketId).emit('updateMessage', resData)
		);
	});

	socket.on('newComment', (data) => {
		io.emit('updateComment', data);
	});

	socket.on('onToggleLike', (data) => {
		io.emit('onUpdateLikes', data);
	});

	socket.on('disconnect', () => {
		onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
		io.emit('onlineUsers', onlineUsers);
	});
});
