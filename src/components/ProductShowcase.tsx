import Image from 'next/image';

export default function ProductShowcase() {
	return (
		<section className='bg-white py-24'>
			<div className='container mx-auto px-6'>
				<div className='grid items-center gap-16 lg:grid-cols-2'>
					<div className='flex justify-center'>
						<Image src='/images/protein-bar.png' alt='Mamafarm Chocolate Fudge Protein Bar' width={500} height={900} priority className='h-auto w-full max-w-md object-contain' />
					</div>

					<div>
						<span className='rounded-full bg-[#EFE5D8] px-4 py-2 font-medium'>Chocolate Fudge</span>

						<h2 className='mt-6 text-5xl font-black text-[#22150D]'>Delicious Meets Nutrition</h2>

						<p className='mt-6 text-lg text-gray-600'>Crafted with premium plant proteins, oats, chicory root fiber and real cocoa for a rich, satisfying taste.</p>

						<ul className='mt-8 space-y-4 text-lg'>
							<li>✓ 18g Plant Protein</li>
							<li>✓ 0g Added Sugar</li>
							<li>✓ 5g Fiber</li>
							<li>✓ Dairy Free</li>
							<li>✓ Real Ingredients</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
}
