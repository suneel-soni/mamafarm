const faqs = [
	{
		question: 'Is Mamafarm Protein Bar vegan?',
		answer: 'Yes. Our protein bar is completely plant-based and contains no dairy ingredients.',
	},
	{
		question: 'Does it contain added sugar?',
		answer: 'No. Mamafarm Protein Bar contains 0g added sugar and is naturally sweetened with dates.',
	},
	{
		question: 'When should I eat this protein bar?',
		answer: 'You can enjoy it as a post-workout snack, mid-day energy boost, travel snack, or healthy alternative to traditional sweets.',
	},
	{
		question: 'Who can consume this protein bar?',
		answer: 'Fitness enthusiasts, professionals, students, vegetarians and anyone looking for a convenient high-protein snack.',
	},
	{
		question: 'Does it contain dairy?',
		answer: 'No. The bar is completely dairy-free.',
	},
	{
		question: 'Is it suitable for weight management?',
		answer: 'The bar provides high protein and fiber, which can help keep you feeling satisfied as part of a balanced diet.',
	},
];

export default function FAQ() {
	return (
		<section className='py-24'>
			<div className='container mx-auto px-6'>
				<div className='mx-auto max-w-4xl'>
					<h2 className='text-center text-5xl font-black text-[#22150D]'>Frequently Asked Questions</h2>

					<div className='mt-12 space-y-4'>
						{faqs.map(faq => (
							<div key={faq.question} className='rounded-2xl bg-white p-6 shadow-sm'>
								<h3 className='text-lg font-bold'>{faq.question}</h3>

								<p className='mt-3 text-gray-600'>{faq.answer}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
