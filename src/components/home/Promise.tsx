'use client';

import { motion, Variants } from 'framer-motion';
import { promiseData } from '../../data/home';
import { CheckCircle, Scroll, Flame, ShieldCheck, HeartHandshake, Smile } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
	CheckCircle: CheckCircle,
	Scroll: Scroll,
	Flame: Flame,
	ShieldCheck: ShieldCheck,
	HeartHandshake: HeartHandshake,
	Smile: Smile,
};

export default function Promise() {
	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.08,
			},
		},
	};

	const itemVariants: Variants = {
		hidden: { opacity: 0, scale: 0.95, y: 15 },
		visible: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: { type: 'spring', stiffness: 100, damping: 15 },
		},
	};

	return (
		<section className='bg-white py-20 lg:py-28' id='promise'>
			<div className='container mx-auto px-4 max-w-6xl'>
				{/* Section Header */}
				<div className='text-center max-w-2xl mx-auto mb-16'>
					<motion.span
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className='inline-block px-4 py-1.5 bg-brand-green/10 text-brand-green rounded-full text-sm font-semibold tracking-wide uppercase mb-4'
					>
						Our Commitments
					</motion.span>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className='text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-green mb-6'
					>
						Our Sincere Promise
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className='text-gray-600 text-base md:text-lg'
					>
						No shortcuts, no compromises. We stand by our commitments to ensure absolute purity and unmatched quality.
					</motion.p>
				</div>

				{/* Promise Cards Grid */}
				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true, margin: '-50px' }}
					className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
				>
					{promiseData.map((promise) => {
						const IconComponent = iconMap[promise.iconName] || CheckCircle;
						return (
							<motion.div
								key={promise.id}
								variants={itemVariants}
								whileHover={{ y: -6, scale: 1.01 }}
								className='bg-brand-cream/30 hover:bg-brand-cream/60 rounded-2xl p-8 border border-brand-green/5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group h-full'
							>
								<div>
									<div className='w-12 h-12 rounded-xl bg-white flex items-center justify-center text-brand-wheat mb-6 border border-brand-green/5 shadow-sm group-hover:bg-brand-wheat group-hover:text-white transition-colors duration-300'>
										<IconComponent className='w-6 h-6' />
									</div>
									<h3 className='text-lg md:text-xl font-extrabold text-brand-green mb-3'>
										{promise.title}
									</h3>
									<p className='text-gray-600 text-sm md:text-base leading-relaxed'>
										{promise.description}
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
