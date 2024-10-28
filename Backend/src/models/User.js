import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const User = new mongoose.Schema(
	{
		first_name: {
			type: String,
			required: true,
		},
		last_name: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
		},
		cover: {
			type: String,
		},
		profile: {
			type: Boolean,
			default: true,
			required: true,
		},
		verify: {
			type: Boolean,
			default: false,
			required: true,
		},
		status: {
			type: Boolean,
			default: true,
			required: true,
		},
		role: {
			type: Boolean,
			default: false,
			required: true,
		},
		following: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	{ timestamps: true }
);

User.methods.follow = async function (userId) {
	if (!this.following.includes(userId)) {
		this.following.push(userId);
		await this.save();
		const followedUser = await this.model('User').findById(userId);
		if (followedUser && !followedUser.followers.includes(this._id)) {
			followedUser.followers.push(this._id);
			await followedUser.save();
		}
	}
};

User.methods.unfollow = async function (userId) {
	if (this.following.includes(userId)) {
		this.following.pull(userId);
		await this.save();
		const followedUser = await this.model('User').findById(userId);
		if (followedUser) {
			followedUser.followers.pull(this._id);
			await followedUser.save();
		}
	}
};

User.methods.isFollowing = function (userId) {
	return this.following.includes(userId);
};

User.methods.isFollowedBy = function (userId) {
	return this.followers.includes(userId);
};

User.methods.getFollowerCount = function () {
	return this.followers.length;
};

User.methods.getFollowingCount = function () {
	return this.following.length;
};

User.pre('save', async function (next) {
	if (this.isModified('password')) {
		try {
			const salt = await bcrypt.genSalt(10);
			this.password = await bcrypt.hash(this.password, salt);
		} catch (error) {
			return next(error);
		}
	}
	next();
});

User.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

export default new mongoose.model('User', User);
