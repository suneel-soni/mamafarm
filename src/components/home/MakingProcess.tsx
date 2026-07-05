'use client';

import { motion } from 'framer-motion';
import { processSteps } from '../../data/home';
import { Award, Eye, Flame, Hand, Package, Soup, Sparkles } from 'lucide-react';

const iconMap: Record<number, React.ComponentType<{ className?: string }>> = {
	1: Sparkles,
	2: Flame,
	3: Soup,
	4: Award,
	5: Eye,
	6: Hand,
	7: Package,
};

export default function MakingProcess() {
	return (
		<section className='bg-white py-20 lg:py-28' id='process'>
			<div className='container mx-auto px-4 max-w-5xl'>
				{/* Section Header */}
				<div className='text-center max-w-2xl mx-auto mb-20'>
					<motion.span
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className='inline-block px-4 py-1.5 bg-brand-green/10 text-brand-green rounded-full text-sm font-semibold tracking-wide uppercase mb-4'
					>
						Traditional Craftsmanship
					</motion.span>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className='text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-green mb-6'
					>
						Prepared with Care
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className='text-gray-600 text-base md:text-lg'
					>
						Observe the traditional steps and meticulous craft that bring authentic MamaFarm laddus from our kitchen to your home.
					</motion.p>
				</div>

				{/* Modern Vertical Timeline */}
				<div className='relative border-l-2 border-brand-wheat/20 ml-4 md:ml-32 md:mr-12 space-y-12 py-4'>
					{processSteps.map((step, index) => {
						const IconComponent = iconMap[step.id] || Sparkles;

						return (
							<motion.div
								key={step.id}
								initial={{ opacity: 0, x: -30 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true, margin: '-80px' }}
								transition={{ duration: 0.6, delay: 0.05 * index, type: 'spring' }}
								className='relative pl-8 md:pl-12 group'
							>
								{/* Step Timeline Indicator dot/icon */}
								<div className='absolute -left-6 md:-left-7 top-0.5 bg-brand-cream border-2 border-brand-wheat rounded-full w-12 h-12 flex items-center justify-center text-brand-wheat shadow-md z-10 group-hover:bg-brand-wheat group-hover:text-white transition-all duration-300'>
									<IconComponent className='w-5 h-5' />
								</div>

								{/* Left Side Label (Desktop Only) */}
								<div className='hidden md:block absolute -left-32 top-3 w-20 text-right text-sm font-black tracking-widest text-brand-wheat/40 font-mono'>
									STEP 0{step.id}
								</div>

								{/* Card Details */}
								<div className='bg-brand-cream/50 hover:bg-brand-cream rounded-2xl p-6 md:p-8 border border-brand-green/5 shadow-sm hover:shadow-md transition-all duration-300'>
									<div className='md:hidden text-xs font-black tracking-widest text-brand-wheat/40 font-mono mb-2'>
										STEP 0{step.id}
									</div>
									<h3 className='text-lg md:text-xl font-extrabold text-brand-green mb-2.5 group-hover:text-brand-wheat transition-colors duration-300'>
										{step.title}
									</h3>
									<p className='text-gray-600 text-sm md:text-base leading-relaxed'>
										{step.description}
									</p>
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
