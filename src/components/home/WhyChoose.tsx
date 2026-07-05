'use client';

import { motion, Variants } from 'framer-motion';
import { Sparkles, BookOpen, Flame, Leaf } from 'lucide-react';
import { whyChooseData } from '../../data/home';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
	Sparkles: Sparkles,
	BookOpen: BookOpen,
	Flame: Flame,
	Leaf: Leaf,
};

export default function WhyChoose() {
	// Animation variants for container and children
	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.15,
			},
		},
	};

	const itemVariants: Variants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: 'spring',
				stiffness: 100,
				damping: 15,
			},
		},
	};

	return (
		<section className='bg-brand-cream py-20 lg:py-28' id='why-choose'>
			<div className='container mx-auto px-4 max-w-6xl'>
				<div className='text-center max-w-2xl mx-auto mb-16'>
					<motion.span
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className='inline-block px-4 py-1.5 bg-brand-green/10 text-brand-green rounded-full text-sm font-semibold tracking-wide uppercase mb-4'
					>
						Why Choose MamaFarm
					</motion.span>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className='text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-green mb-6 leading-tight'
					>
						Made with Purity.<br />
						<span className='text-brand-wheat font-serif italic font-normal'>Crafted with Tradition.</span>
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className='text-gray-600 text-base md:text-lg leading-relaxed'
					>
						At MamaFarm, every Desi Ghee Besan Laddu is handcrafted using carefully selected premium ingredients and traditional recipes.
					</motion.p>
				</div>

				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true, margin: '-100px' }}
					className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'
				>
					{whyChooseData.map((card) => {
						const IconComponent = iconMap[card.iconName] || Sparkles;
						return (
							<motion.div
								key={card.id}
								variants={itemVariants}
								whileHover={{ y: -8, scale: 1.02 }}
								className='bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-brand-green/5 transition-all duration-300 flex flex-col justify-between h-full'
							>
								<div>
									<div className='w-14 h-14 bg-brand-cream rounded-xl flex items-center justify-center mb-6 text-brand-wheat border border-brand-wheat/10'>
										<IconComponent className='w-7 h-7' />
									</div>
									<h3 className='text-xl font-bold text-brand-green mb-3'>{card.title}</h3>
									<p className='text-gray-600 text-sm md:text-base leading-relaxed'>{card.description}</p>
								</div>
							</motion.div>
						);
					})}
				</motion.div>
			</div>
		</section>
	);
}
