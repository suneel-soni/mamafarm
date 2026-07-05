import Hero from '../components/Hero';
import WhyChoose from '../components/home/WhyChoose';
import Ingredients from '../components/home/Ingredients';
import WhyUs from '../components/home/WhyUs';
import MakingProcess from '../components/home/MakingProcess';
import Occasions from '../components/home/Occasions';
import Promise from '../components/home/Promise';
import Faq from '../components/home/Faq';
import CTA from '../components/home/CTA';

export default function Home() {
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'Mamafarm',
		url: 'https://mamafarm.com',
		logo: 'https://mamafarm.com/images/mamafarm-logo.png',
		description: 'Pure Ingredients. True Goodness. Premium food brand specializing in traditional Desi Ghee Besan Laddu in India.',
		contactPoint: {
			'@type': 'ContactPoint',
			telephone: '+91-8130188878',
			contactType: 'customer service',
		},
	};

	return (
		<>
			<script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

			<Hero />
			<WhyChoose />
			<Ingredients />
			<WhyUs />
			<MakingProcess />
			<Occasions />
			<Promise />
			<Faq />
			<CTA />
		</>
	);
}
