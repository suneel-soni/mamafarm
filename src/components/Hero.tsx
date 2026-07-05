import Image from 'next/image';

export default function Hero() {
	return (
		<section className='w-full mx-auto'>
			{/* Mobile Hero */}
			<Image src='/images/mamafarm-ghee-besan-laddu-banner-portrait.png' alt='Mamafarm desi ghee besan laddu' width={1080} height={1920} priority className='h-auto w-full md:hidden' />

			{/* Desktop Hero */}
			<Image src='/images/mamafarm-ghee-besan-laddu-banner-landscape.png' alt='Mamafarm desi ghee besan laddu' width={1920} height={1080} priority className='hidden h-auto w-full md:block' />
		</section>
	);
}
