import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import { ChevronRightIcon, ChevronLeftIcon } from '../Icons';

const cx = classNames.bind(styles);

const MediaSlider = ({ attachments = [] }) => {
	const [index, setIndex] = useState(0);
	const [max, setMax] = useState(0);
	const videoRefs = useRef([]);
	const [isPlaying, setIsPlaying] = useState({});

	useEffect(() => {
		setIndex(0);
		setMax(attachments?.length - 1 || 0);
	}, [attachments]);

	const back = () => {
		setIndex((i) => (i > 0 ? i - 1 : 0));
	};
	const next = () => {
		setIndex((i) => (i < max ? i + 1 : max));
	};

	useEffect(() => {
		videoRefs.current.map((video) => {
			if (video && !video.paused) {
				video.pause();
			}
		});
	}, [index]);

	const toggleVideo = (index) => {
		if (videoRefs.current[index].paused) {
			videoRefs.current[index].play();
			setIsPlaying((state) => ({ ...state, [index]: true }));
		} else {
			videoRefs.current[index].pause();
			setIsPlaying((state) => ({ ...state, [index]: false }));
		}
	};

	return (
		<div className={cx('wrapper')}>
			{max > 0 && index !== 0 && (
				<span className={cx('btn-back')} onClick={back}>
					<ChevronLeftIcon />
				</span>
			)}
			{attachments.map((att, i) => {
				const styles = {
					position: i === index ? 'relative' : 'absolute',
					transform: `translateX(${(i - index) * 100}%)`,
				};
				return att.type === 'image' ? (
					<img key={att._id} src={att.url} alt='image-preview' style={styles} />
				) : (
					<video
						key={att._id}
						src={att.url}
						style={styles}
						ref={(ref) => (videoRefs.current[i] = ref)}
						onClick={() => toggleVideo(i)}
					/>
				);
			})}
			{max > 0 && (
				<ul className={cx('page')}>
					{Array.from({ length: max + 1 }).map((_, i) => (
						<li key={i} className={cx({ active: i === index })}></li>
					))}
				</ul>
			)}
			{max > 0 && index < max && (
				<span className={cx('btn-next')} onClick={next}>
					<ChevronRightIcon />
				</span>
			)}
		</div>
	);
};

export default MediaSlider;
