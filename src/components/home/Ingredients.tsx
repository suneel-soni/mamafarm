'use client';

import { motion, Variants } from 'framer-motion';
import { ingredientsData } from '../../data/home';
import IngredientCard from './IngredientCard';

export default function Ingredients() {
	// Container and items animation variants
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
		hidden: { opacity: 0, scale: 0.92, y: 20 },
		visible: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: {
				type: 'spring',
				stiffness: 100,
				damping: 15,
			},
		},
	};

	return (
		<section className='bg-white py-20 lg:py-28' id='ingredients'>
			<div className='container mx-auto px-4 max-w-6xl'>
				<div className='text-center max-w-2xl mx-auto mb-16'>
					<motion.span
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className='inline-block px-4 py-1.5 bg-brand-wheat/10 text-brand-wheat rounded-full text-sm font-semibold tracking-wide uppercase mb-4'
					>
						Only Premium Ingredients
					</motion.span>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className='text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-green mb-6'
					>
						Made with Pure Goodness
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className='text-gray-600 text-base md:text-lg'
					>
						Every ingredient is carefully selected to deliver authentic taste and unmatched quality.
					</motion.p>
				</div>

				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true, margin: '-50px' }}
					className='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8'
				>
					{ingredientsData.map((ingredient) => (
						<motion.div key={ingredient.id} variants={itemVariants}>
							<IngredientCard ingredient={ingredient} />
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
