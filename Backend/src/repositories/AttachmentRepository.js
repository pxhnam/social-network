import Attachment from '../models/Attachment.js';

const AttachmentRepository = {
	create: async (type, url) => {
		try {
			const attachment = new Attachment({ type, url });
			return await attachment.save();
		} catch (error) {
			throw error;
		}
	},
	createMany: async (attachments) => {
		try {
			return await Attachment.insertMany(attachments);
		} catch (error) {
			throw error;
		}
	},
};

export default AttachmentRepository;
