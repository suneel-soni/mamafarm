export default function Nutrition() {
	return (
		<section className='py-24'>
			<div className='container mx-auto px-6 max-w-4xl'>
				<h2 className='text-center text-5xl font-black text-[#22150D]'>Nutrition Facts</h2>

				<div className='mt-12 rounded-2xl bg-white p-8'>
					<table className='w-full'>
						<tbody>
							<tr className='border-b'>
								<td className='py-4'>Serving Size</td>
								<td className='py-4 text-right'>50g</td>
							</tr>

							<tr className='border-b'>
								<td className='py-4'>Energy</td>
								<td className='py-4 text-right'>180 kcal</td>
							</tr>

							<tr className='border-b'>
								<td className='py-4'>Protein</td>
								<td className='py-4 text-right'>18g</td>
							</tr>

							<tr className='border-b'>
								<td className='py-4'>Fat</td>
								<td className='py-4 text-right'>3.5g</td>
							</tr>

							<tr className='border-b'>
								<td className='py-4'>Carbohydrates</td>
								<td className='py-4 text-right'>17g</td>
							</tr>

							<tr className='border-b'>
								<td className='py-4'>Fiber</td>
								<td className='py-4 text-right'>5g</td>
							</tr>

							<tr>
								<td className='py-4'>Added Sugar</td>
								<td className='py-4 text-right'>0g</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</section>
	);
}
