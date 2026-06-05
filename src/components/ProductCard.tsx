import { Check } from 'lucide-react';
import Image from 'next/image';
import { Product } from '../types';

const ProductCard = ({ product }: { product: Product }) => {
	return (
		<div className='bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group'>
			<div className='relative h-96 w-full bg-gradient-to-b from-[#faf8f3] to-white p-6'>
				<Image src={product.image} alt={product.title} fill className='object-contain transition-transform duration-300 group-hover:scale-105' />

				<div className='absolute top-4 right-4 bg-brand-green text-white text-xs font-semibold px-3 py-1 rounded-full'>100% Natural</div>
			</div>

			<div className='p-6'>
				<h3 className='text-2xl font-bold text-brand-green mb-3'>{product.title}</h3>

				<p className='text-gray-600 mb-5'>{product.description}</p>

				<div className='space-y-2 mb-6'>
					{product.features.map((feature, index) => (
						<div key={index} className='flex items-center text-sm text-gray-700'>
							<Check size={16} className='text-brand-green mr-2 shrink-0' />
							<span>{feature}</span>
						</div>
					))}
				</div>

				<button className='w-full btn-outline py-3'>Learn More</button>
			</div>
		</div>
	);
};

export default ProductCard;
