export default function BrandStory() {
	return (
		<section className='bg-[#22150D] py-24 text-white'>
			<div className='container mx-auto px-6'>
				<div className='mx-auto max-w-4xl text-center'>
					<span className='rounded-full bg-[#2F6B3D] px-4 py-2 text-sm font-semibold'>Our Story</span>

					<h2 className='mt-6 text-5xl font-black'>Why Mamafarm?</h2>

					<p className='mt-8 text-lg leading-8 text-gray-300'>
						At Mamafarm, we believe nutrition should come from real ingredients, not complicated formulas. We created our Chocolate Fudge Protein Bar to provide convenient, delicious and honest
						nutrition for modern lifestyles.
					</p>

					<p className='mt-6 text-lg leading-8 text-gray-300'>
						Made with Soy & Pea Protein, oats, chicory root fiber and real cocoa, every bar delivers high-quality plant-based nutrition without compromising on taste.
					</p>

					<div className='mt-12 grid gap-6 md:grid-cols-3'>
						<div>
							<h3 className='text-4xl font-black text-[#C89B3C]'>18g</h3>
							<p className='mt-2'>Plant Protein</p>
						</div>

						<div>
							<h3 className='text-4xl font-black text-[#C89B3C]'>0g</h3>
							<p className='mt-2'>Added Sugar</p>
						</div>

						<div>
							<h3 className='text-4xl font-black text-[#C89B3C]'>5g</h3>
							<p className='mt-2'>Fiber</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
