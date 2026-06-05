'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Header = () => {
	const [showHeader, setShowHeader] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setShowHeader(window.scrollY > 250);
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out
			${showHeader ? 'translate-y-0 opacity-100 py-2 bg-gradient-to-r from-transparent via-white/80 to-transparent backdrop-blur-md' : '-translate-y-full opacity-0 pointer-events-none'}`}>
			<div className='container mx-auto px-4'>
				<div className='flex justify-center items-center'>
					<Link href='/'>
						<Image src='/images/mamafarm-logo.png' alt='Mamafarm Logo' width={300} height={120} priority className='h-12 md:h-14 w-auto' />
					</Link>
				</div>
			</div>
		</header>
	);
};

export default Header;
