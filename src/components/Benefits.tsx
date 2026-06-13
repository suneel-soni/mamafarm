const benefits = [
	{
		title: '18g Protein',
		desc: 'Supports muscle recovery and daily protein intake.',
	},
	{
		title: 'No Added Sugar',
		desc: 'Naturally sweetened without refined sugar.',
	},
	{
		title: '5g Fiber',
		desc: 'Supports digestive wellness and satiety.',
	},
	{
		title: 'Plant Based',
		desc: 'Powered by Soy & Pea Protein.',
	},
];

export default function Benefits() {
	return (
		<section className='py-24'>
			<div className='container mx-auto px-6'>
				<h2 className='text-center text-5xl font-black text-[#22150D]'>Why You'll Love It</h2>

				<div className='mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
					{benefits.map(item => (
						<div key={item.title} className='rounded-2xl bg-white p-8 shadow-sm'>
							<h3 className='text-xl font-bold'>{item.title}</h3>

							<p className='mt-3 text-gray-600'>{item.desc}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
