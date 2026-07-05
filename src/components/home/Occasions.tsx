'use client';

import { motion, Variants } from 'framer-motion';
import { occasionsData } from '../../data/home';
import { Sparkles, Briefcase, Users, Gift, Building, Heart } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
	Sparkles: Sparkles,
	Briefcase: Briefcase,
	Users: Users,
	Gift: Gift,
	Building: Building,
	Heart: Heart,
};

export default function Occasions() {
	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants: Variants = {
		hidden: { opacity: 0, y: 25 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { type: 'spring', stiffness: 100, damping: 15 },
		},
	};

	return (
		<section className='bg-brand-cream py-20 lg:py-28' id='occasions'>
			<div className='container mx-auto px-4 max-w-6xl'>
				{/* Section Header */}
				<div className='text-center max-w-2xl mx-auto mb-16'>
					<motion.span
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className='inline-block px-4 py-1.5 bg-brand-wheat/10 text-brand-wheat rounded-full text-sm font-semibold tracking-wide uppercase mb-4'
					>
						Share The Sweetness
					</motion.span>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className='text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-green mb-6'
					>
						Perfect For Every Occasion
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className='text-gray-600 text-base md:text-lg'
					>
						Whether it’s a major festival or a simple moment of self-indulgence, make it special with handcrafted tradition.
					</motion.p>
				</div>

				{/* Cards Grid */}
				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true, margin: '-50px' }}
					className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
				>
					{occasionsData.map((occasion) => {
						const IconComponent = iconMap[occasion.iconName] || Gift;
						return (
							<motion.div
								key={occasion.id}
								variants={itemVariants}
								whileHover={{ y: -8, scale: 1.02 }}
								className='bg-white rounded-2xl p-8 border border-brand-green/5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full'
							>
								<div>
									<div className='w-12 h-12 rounded-xl bg-brand-cream flex items-center justify-center text-brand-green group-hover:bg-brand-green group-hover:text-white transition-colors duration-300 mb-6 border border-brand-green/5 shadow-sm'>
										<IconComponent className='w-6 h-6' />
									</div>
									<h3 className='text-xl font-bold text-brand-green group-hover:text-brand-wheat transition-colors duration-300 mb-3'>
										{occasion.title}
									</h3>
									<p className='text-gray-600 text-sm md:text-base leading-relaxed'>
										{occasion.description}
									</p>
								</div>
							</motion.div>
						);
					})}
				</motion.div>
			</div>
		</section>
	);
}
