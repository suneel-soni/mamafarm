import Benefits from '../components/Benefits';
import BrandStory from '../components/BrandStory';
import CTA from '../components/CTA';
import FAQ from '../components/FAQ';
import Hero from '../components/Hero';
import Ingredients from '../components/Ingredients';
import Nutrition from '../components/Nutrition';
import ProductShowcase from '../components/ProductShowcase';
import Stats from '../components/Stats';

export default function Home() {
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'Mamafarm',
		url: 'https://mamafarm.com',
		logo: 'https://mamafarm.com/images/mamafarm-logo.png',
		description: 'Pure Ingredients. True Goodness. Organic Food Brand in India.',
		contactPoint: {
			'@type': 'ContactPoint',
			telephone: '+91-98765-43210',
			contactType: 'customer service',
		},
	};

	return (
		<>
			<script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

			<Hero />
			<Stats />
			<ProductShowcase />
			<BrandStory />
			<Benefits />
			<Ingredients />
			<Nutrition />
			<FAQ />
			<CTA />
		</>
	);
}
