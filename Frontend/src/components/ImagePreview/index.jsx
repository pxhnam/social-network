import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { ChevronRightIcon, ChevronLeftIcon } from '../Icons';
import { useEffect, useState } from 'react';
const cls = classNames.bind(styles);

const ImagePreview = ({ attachments = [] }) => {
	const [images, setImages] = useState(attachments || []);
	const [index, setIndex] = useState(0);
	const [max, setMax] = useState(0);

	useEffect(() => {
		setImages(attachments);
		setMax(images?.length - 1 || 0);
	}, []);

	const back = () => {
		setIndex((i) => (i > 0 ? i - 1 : 0));
	};
	const next = () => {
		setIndex((i) => (i < max ? i + 1 : max));
	};

	return (
		<div className={cls('wrapper')}>
			{max > 0 && index !== 0 && (
				<span className={cls('btn-back')} onClick={back}>
					<ChevronLeftIcon />
				</span>
			)}
			{images.map((image, i) => (
				<img
					key={i}
					src={image.url}
					alt='image-preview'
					className={cls({ hide: i !== index })}
				/>
			))}
			{max > 0 && (
				<ul className={cls('page')}>
					{Array.from({ length: max + 1 }).map((_, i) => (
						<li key={i} className={cls({ active: i === index })}></li>
					))}
				</ul>
			)}
			{max > 0 && index < max && (
				<span className={cls('btn-next')} onClick={next}>
					<ChevronRightIcon />
				</span>
			)}
		</div>
	);
};

export default ImagePreview;
