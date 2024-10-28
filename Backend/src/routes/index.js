import userRouter from './user.js';
import postRouter from './post.js';
import commentRouter from './comment.js';
import chatRouter from './chat.js';
import messageRouter from './message.js';

const routers = [
	{ path: 'users', router: userRouter },
	{ path: 'posts', router: postRouter },
	{ path: 'comments', router: commentRouter },
	{ path: 'chats', router: chatRouter },
	{ path: 'messages', router: messageRouter },
];

const route = (app) => {
	routers.map(({ path, router }) => {
		app.use(`/api/${path}`, router);
	});
};

export default route;
