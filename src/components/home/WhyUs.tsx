'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { whyUsChecklist } from '../../data/home';

export default function WhyUs() {
	return (
		<section className='bg-brand-cream py-20 lg:py-28' id='why-us'>
			<div className='container mx-auto px-4 max-w-6xl'>
				<div className='grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center'>
					{/* Left Column: Image */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.7, type: 'spring', stiffness: 80 }}
						className='lg:col-span-6 relative aspect-square md:max-w-md lg:max-w-none mx-auto w-full rounded-2xl overflow-hidden shadow-xl border border-brand-green/5 group'
					>
						<Image
							src='/images/laddu-bowl.jpg'
							alt='Handcrafted Desi Ghee Besan Laddu in a bowl'
							fill
							sizes='(max-width: 1024px) 100vw, 50vw'
							className='object-cover transition-transform duration-700 group-hover:scale-105'
							loading='lazy'
						/>
						{/* Subtle elegant overlays */}
						<div className='absolute inset-0 bg-gradient-to-tr from-brand-green/20 via-transparent to-transparent mix-blend-overlay' />
						<div className='absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-5 rounded-xl border border-white/20 shadow-lg hidden sm:block'>
							<p className='text-brand-green font-bold text-lg mb-1'>Freshly Handcrafted daily</p>
							<p className='text-gray-600 text-sm'>No preservatives, no chemicals—just pure, honest ingredients.</p>
						</div>
					</motion.div>

					{/* Right Column: Content and Checklist */}
					<div className='lg:col-span-6 flex flex-col justify-center'>
						<motion.span
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
							className='inline-block px-4 py-1.5 bg-brand-green/10 text-brand-green rounded-full text-sm font-semibold tracking-wide uppercase mb-4 self-start'
						>
							Uncompromised Quality
						</motion.span>
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className='text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-green mb-6'
						>
							Why Customers Love <br />
							<span className='text-brand-wheat font-serif italic font-normal'>MamaFarm</span>
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className='text-gray-600 text-base md:text-lg mb-8 leading-relaxed'
						>
							We believe that pure food leads to true goodness. Each laddu is slow-roasted, carefully hand-rolled, and packed immediately to preserve the natural goodness, rich aroma, and wholesome taste.
						</motion.p>

						{/* Checklist Grid */}
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							{whyUsChecklist.map((item, index) => (
								<motion.div
									key={item}
									initial={{ opacity: 0, x: 30 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: 0.1 * index }}
									className='flex items-center space-x-3.5 bg-white py-3.5 px-5 rounded-xl border border-brand-green/5 shadow-sm hover:shadow transition-shadow'
								>
									<div className='flex-shrink-0 w-6 h-6 bg-brand-green text-white rounded-full flex items-center justify-center shadow-sm shadow-brand-green/20'>
										<Check className='w-4 h-4 stroke-[3]' />
									</div>
									<span className='font-bold text-brand-green text-sm sm:text-base'>{item}</span>
								</motion.div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
