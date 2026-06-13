import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Mamafarm | Pure Ingredients. True Goodness.',
	description: 'Farm-fresh rice, atta, besan, dal, spices and nutritious protein bars crafted with care for every family. 100% natural and organic products from Mamafarm.',
	keywords: 'Organic Food India, Premium Rice, Whole Wheat Atta, Chana Besan, Indian Dal, Natural Spices, Protein Bar India, Farm Fresh Food, Mamafarm',
	openGraph: {
		title: 'Mamafarm | Pure Ingredients. True Goodness.',
		description: 'Farm-fresh rice, atta, besan, dal, spices and nutritious protein bars crafted with care.',
		url: 'https://mamafarm.com',
		siteName: 'Mamafarm',
		images: [
			{
				url: '/images/hero-products.png',
				width: 1200,
				height: 630,
				alt: 'Mamafarm Products',
			},
		],
		locale: 'en_IN',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Mamafarm | Pure Ingredients. True Goodness.',
		description: 'Farm-fresh organic products crafted with care.',
		images: ['/images/hero-products.png'],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className='scroll-smooth'>
			<body className={inter.className}>
				<Header />
				<main>{children}</main>
				<Footer />
			</body>
		</html>
	);
}
