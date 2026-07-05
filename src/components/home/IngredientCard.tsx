'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Ingredient } from '../../types/home';

interface IngredientCardProps {
	ingredient: Ingredient;
}

export default function IngredientCard({ ingredient }: IngredientCardProps) {
	return (
		<motion.div
			whileHover={{ y: -6, scale: 1.01 }}
			transition={{ type: 'spring', stiffness: 150, damping: 15 }}
			className='group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-brand-green/5 transition-all duration-300 flex flex-col h-full'
		>
			<div className='relative h-48 md:h-52 w-full overflow-hidden bg-brand-cream/50'>
				<Image
					src={ingredient.image}
					alt={ingredient.name}
					fill
					sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
					className='object-cover transition-transform duration-700 ease-out group-hover:scale-110'
					loading='lazy'
				/>
				<div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
			</div>
			<div className='p-5 md:p-6 flex flex-col flex-grow'>
				<h3 className='text-lg md:text-xl font-bold text-brand-green mb-2 group-hover:text-brand-wheat transition-colors duration-300'>
					{ingredient.name}
				</h3>
				<p className='text-gray-600 text-xs md:text-sm leading-relaxed flex-grow'>
					{ingredient.description}
				</p>
			</div>
		</motion.div>
	);
}
