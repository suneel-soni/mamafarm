export default function Stats() {
	const stats = [
		{
			value: '18g',
			label: 'Protein',
		},
		{
			value: '0g',
			label: 'Added Sugar',
		},
		{
			value: '5g',
			label: 'Fiber',
		},
		{
			value: '180',
			label: 'Calories',
		},
	];

	return (
		<section className='bg-[#22150D] py-14 text-white'>
			<div className='container mx-auto px-6'>
				<div className='grid grid-cols-2 lg:grid-cols-4 gap-10'>
					{stats.map(item => (
						<div key={item.label} className='text-center'>
							<h3 className='text-5xl font-black'>{item.value}</h3>

							<p className='mt-2 text-gray-300'>{item.label}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
