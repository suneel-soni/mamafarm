import Image from 'next/image';

const Hero = () => {
	return (
		<section className='relative w-full overflow-hidden'>
			<Image src='/images/hero-banner-1.png' alt='Mamafarm Hero Banner' width={1920} height={1080} priority className='w-full h-auto block' />
		</section>
	);
};

export default Hero;
