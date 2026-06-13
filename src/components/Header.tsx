'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 50);
		};

		window.addEventListener('scroll', handleScroll);

		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<header className={`sticky top-0 z-50 border-b border-black/5 bg-brand-cream/80 backdrop-blur-md transition-all duration-300 ${scrolled ? 'py-1' : 'py-3'}`}>
			<div className='container mx-auto px-4'>
				<div className='flex items-center justify-center'>
					<Link href='/' className='transition-transform duration-300 hover:scale-105'>
						<Image
							src='/images/mamafarm-logo.png'
							alt='Mamafarm Logo'
							width={300}
							height={120}
							priority
							className={`w-auto transition-all duration-300 ${scrolled ? 'h-10 md:h-14' : 'h-16 md:h-24'}`}
						/>
					</Link>
				</div>
			</div>
		</header>
	);
};

export default Header;
