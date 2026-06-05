import About from '../components/About';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import WhyChoose from '../components/WhyChoose';
import { PRODUCTS } from '../constants';

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

			{/* Products Section */}
			<section id='products' className='py-16 md:py-24 bg-white'>
				<div className='container mx-auto px-4 md:px-6'>
					<div className='text-center mb-16'>
						<h2 className='text-4xl md:text-5xl font-bold text-brand-green mb-4'>Our Products</h2>
						<p className='text-xl text-gray-600 max-w-2xl mx-auto'>From our fields to your kitchen, we bring you the finest quality organic essentials.</p>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12'>
						{PRODUCTS.map(product => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				</div>
			</section>

			<About />
			<WhyChoose />
			{/* <ContactForm /> */}
			{/* <FeedbackForm /> */}
		</>
	);
}
