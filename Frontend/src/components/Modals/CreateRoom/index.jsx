import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import ModalLayout from '../Layout';
import styles from './styles.module.scss';

const cls = classNames.bind(styles);

const CreateRoom = ({ state, setState }) => {
	const [avatar, setAvatar] = useState();
	const [members, setMembers] = useState([]);
	const [text, setText] = useState('');

	useEffect(() => {
		return () => {
			if (avatar) {
				URL.revokeObjectURL(avatar.preview);
			}
		};
	}, [avatar]);

	const handleUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			file.preview = URL.createObjectURL(file);
			setAvatar(file);
		} else {
			e.target.value = null;
		}
	};

	const handleAddMember = (e) => {
		if (e.key === 'Enter') {
			console.log('enter');
			setMembers((data) => [...data, text]);
			setText('');
		}
	};
	const handleSubmit = (e) => {
		e.Preventdefault();
	};

	return (
		<ModalLayout state={state} setState={setState}>
			<form className={cls('form')} onSubmit={handleSubmit}>
				<h2 className={cls('form-title')}>Tạo Nhóm</h2>
				<div className={cls('form-avatar')}>
					<label htmlFor='group-avatar'>
						<input type='file' id='group-avatar' onChange={handleUpload} />
					</label>
					<img
						src={
							avatar?.preview ||
							'http://127.0.0.1:3000/uploads/default-group-avatar.svg'
						}
						alt='avatar group'
					/>
				</div>
				<div className={cls('form-input')}>
					<input type='text' id='group-name' placeholder='' />
					<label htmlFor='group-name'>Tên Nhóm</label>
				</div>
				{members.length > 0 && (
					<div className={cls('form-members')}>
						Thành viên: {members.join(', ')}
					</div>
				)}
				<div className={cls('form-input')}>
					<input
						type='text'
						id='member-name'
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder=''
						onKeyDown={handleAddMember}
					/>
					<label htmlFor='member-name'>Mời</label>
				</div>
			</form>
		</ModalLayout>
	);
};

export default CreateRoom;
