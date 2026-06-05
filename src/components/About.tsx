import Image from 'next/image';

const About = () => {
	return (
		<section id='about' className='py-16 md:py-24 bg-white'>
			<div className='container mx-auto px-4 md:px-6'>
				<div className='flex flex-col lg:flex-row items-center gap-16'>
					<div className='lg:w-1/2'>
						<div className='relative rounded-3xl overflow-hidden shadow-2xl'>
							<Image src='/images/roots.png' alt='Mamafarm Roots' width={600} height={450} className='w-full object-cover' />
							<div className='absolute inset-0 bg-brand-green/20'></div>
						</div>
					</div>

					<div className='lg:w-1/2'>
						<h2 className='text-4xl md:text-5xl font-bold text-brand-green mb-8'>Our Roots</h2>
						<p className='text-lg text-gray-700 mb-6 leading-relaxed'>
							Mamafarm brings authentic farm goodness directly to your home. Our journey began with a simple mission: to provide every family with the same pure, unadulterated ingredients that we grew
							up with on our own farms.
						</p>
						<p className='text-lg text-gray-700 mb-8 leading-relaxed'>
							We believe that true goodness comes from nature. That's why we work closely with local farmers who share our passion for quality and sustainability. From the golden wheat fields to the
							aromatic spice gardens, every Mamafarm product is a testament to our commitment to purity and health.
						</p>

						<div className='grid grid-cols-2 gap-6'>
							<div className='p-4 bg-brand-cream rounded-xl border-l-4 border-brand-green'>
								<h4 className='font-bold text-brand-green mb-1'>Authentic</h4>
								<p className='text-sm text-gray-600'>Straight from the source</p>
							</div>
							<div className='p-4 bg-brand-cream rounded-xl border-l-4 border-brand-brown'>
								<h4 className='font-bold text-brand-brown mb-1'>Pure</h4>
								<p className='text-sm text-gray-600'>No hidden additives</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default About;
