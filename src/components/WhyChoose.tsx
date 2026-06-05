import { Award, Heart, Leaf, ShieldCheck, UserCheck, Zap } from 'lucide-react';

const features = [
	{
		icon: Leaf,
		title: 'Farm Fresh',
		description: 'Sourced directly from selected farms at the peak of freshness.',
		color: 'bg-green-100 text-green-700',
	},
	{
		icon: ShieldCheck,
		title: '100% Natural',
		description: 'Completely free from synthetic chemicals and harmful pesticides.',
		color: 'bg-blue-100 text-blue-700',
	},
	{
		icon: Award,
		title: 'Premium Quality',
		description: 'Rigorous quality checks to ensure only the best reaches your kitchen.',
		color: 'bg-amber-100 text-amber-700',
	},
	{
		icon: Zap,
		title: 'No Additives',
		description: 'Pure ingredients with zero artificial flavors, colors, or preservatives.',
		color: 'bg-orange-100 text-orange-700',
	},
	{
		icon: UserCheck,
		title: 'Trusted Sourcing',
		description: 'Transparent supply chain with deep roots in local farming communities.',
		color: 'bg-purple-100 text-purple-700',
	},
	{
		icon: Heart,
		title: 'Made With Care',
		description: 'Every pack is handled with the love and care your family deserves.',
		color: 'bg-rose-100 text-rose-700',
	},
];

const WhyChoose = () => {
	return (
		<section className='py-16 md:py-24 bg-brand-cream'>
			<div className='container mx-auto px-4 md:px-6 text-center'>
				<h2 className='text-4xl md:text-5xl font-bold text-brand-green mb-4'>Why Mamafarm?</h2>
				<p className='text-xl text-gray-600 mb-16 max-w-2xl mx-auto'>We are committed to delivering purity and nutrition in every bite.</p>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
					{features.map((feature, index) => (
						<div key={index} className='bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow'>
							<div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
								<feature.icon size={28} />
							</div>
							<h3 className='text-xl font-bold text-brand-green mb-3'>{feature.title}</h3>
							<p className='text-gray-600'>{feature.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default WhyChoose;
