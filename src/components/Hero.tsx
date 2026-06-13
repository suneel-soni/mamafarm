import Image from 'next/image';

export default function Hero() {
	return (
		<section className='container mx-auto'>
			{/* Mobile Hero */}
			<Image src='/images/hero-protein-bar-mobile.png' alt='Mamafarm Protein Bar' width={1080} height={1920} priority className='h-auto w-full md:hidden' />

			{/* Desktop Hero */}
			<Image src='/images/hero-protein-bar.png' alt='Mamafarm Protein Bar' width={1920} height={1080} priority className='hidden h-auto w-full md:block' />
		</section>
	);
}
