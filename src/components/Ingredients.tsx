const ingredients = [
	{
		title: 'Soy Protein Isolate',
		desc: 'High-quality protein source with excellent amino acid profile.',
	},
	{
		title: 'Pea Protein Isolate',
		desc: 'Complements soy protein and improves texture.',
	},
	{
		title: 'Oat Flour',
		desc: 'Provides wholesome carbohydrates and structure.',
	},
	{
		title: 'Inulin',
		desc: 'Prebiotic chicory root fiber for digestive wellness.',
	},
	{
		title: 'Date Paste',
		desc: 'Natural sweetness without refined sugar.',
	},
	{
		title: 'Cocoa Powder',
		desc: 'Rich chocolate flavor from real cocoa.',
	},
];

export default function Ingredients() {
	return (
		<section className='bg-white py-24'>
			<div className='container mx-auto px-6'>
				<h2 className='text-center text-5xl font-black text-[#22150D]'>Real Ingredients</h2>

				<div className='mt-14 grid lg:grid-cols-2 gap-6'>
					{ingredients.map(item => (
						<div key={item.title} className='rounded-xl border p-6'>
							<h3 className='font-bold text-xl'>{item.title}</h3>

							<p className='mt-2 text-gray-600'>{item.desc}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
