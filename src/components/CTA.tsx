export default function CTA() {
	return (
		<section className='pb-24'>
			<div className='container mx-auto px-6'>
				<div className='rounded-3xl bg-[#2F6B3D] px-8 py-16 text-center text-white'>
					<h2 className='text-4xl md:text-5xl font-black'>Fuel Your Day With Real Protein</h2>

					<p className='mx-auto mt-6 max-w-2xl text-lg text-green-100'>High protein, no added sugar and made with real ingredients. The perfect snack for your active lifestyle.</p>

					<div className='mt-8 flex flex-wrap justify-center gap-4'>
						<div className='rounded-full bg-white/20 px-4 py-2'>18g Protein</div>

						<div className='rounded-full bg-white/20 px-4 py-2'>0g Added Sugar</div>

						<div className='rounded-full bg-white/20 px-4 py-2'>5g Fiber</div>
					</div>

					{/* <button className='mt-10 rounded-xl bg-white px-8 py-4 font-semibold text-[#2F6B3D] transition hover:scale-105'>Buy Now</button> */}
				</div>
			</div>
		</section>
	);
}
