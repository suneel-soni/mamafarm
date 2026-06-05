import { getImageProps } from 'next/image';

export default function Hero() {
	const common = {
		alt: 'Mamafarm Hero Banner',
		sizes: '100vw',
	};

	const {
		props: { srcSet: desktop },
	} = getImageProps({
		...common,
		width: 1920,
		height: 1080,
		src: '/images/hero-banner-1.png',
	});

	const {
		props: { srcSet: mobile, ...rest },
	} = getImageProps({
		...common,
		width: 1080,
		height: 1920,
		src: '/images/hero-banner-mobile-1.png',
	});

	return (
		<section className='relative w-full overflow-hidden'>
			<picture>
				<source media='(max-width: 767px)' srcSet='/images/hero-banner-mobile-1.png' />
				<img src='/images/hero-banner-1.png' alt='Mamafarm Hero Banner' className='block w-full h-auto' />
			</picture>
		</section>
	);
}
