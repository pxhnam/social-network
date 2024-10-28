import mongoose from 'mongoose';
import TAttachment from '../constants/TAttachment.js';

const Attachment = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: TAttachment.values(),
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

export default new mongoose.model('Attachment', Attachment);
