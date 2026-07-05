'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 100);
		};

		window.addEventListener('scroll', handleScroll);

		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 border-b border-black/5 bg-brand-cream/90 backdrop-blur-md transition-all duration-500 ease-in-out ${scrolled
					? 'translate-y-0 opacity-100 shadow-sm py-2'
					: '-translate-y-full opacity-0 pointer-events-none py-2'
				}`}
		>
			<div className='container mx-auto px-4'>
				<div className='flex items-center justify-center'>
					<Link href='/' className='transition-transform duration-300 hover:scale-105'>
						<Image
							src='/images/mamafarm-logo-light.png'
							alt='Mamafarm Logo'
							width={300}
							height={120}
							priority
							className='h-10 md:h-14 w-auto transition-all duration-300'
						/>
					</Link>
				</div>
			</div>
		</header>
	);
};

export default Header;
