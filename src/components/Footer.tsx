import { Facebook, Instagram, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
	return (
		<footer className='bg-[#22150D] text-white'>
			<div className='container mx-auto px-6 py-16'>
				<div className='mx-auto max-w-4xl text-center'>
					{/* Logo */}
					<Link href='/' className='inline-block'>
						<Image src='/images/mamafarm_logo.png' alt='Mamafarm' width={300} height={120} className='mx-auto h-20 w-auto md:h-24' />
					</Link>

					{/* Tagline */}
					<p className='mt-6 text-xl font-medium text-[#D8C3A5]'>Pure Ingredients. True Goodness.</p>

					<p className='mx-auto mt-4 max-w-2xl text-white/70'>Premium plant-based nutrition made with carefully sourced ingredients. Clean, delicious, and crafted to support your active lifestyle.</p>

					{/* Contact */}
					<div className='mt-8 hidden flex-col items-center gap-3 text-sm text-white/70 md:flex-row md:justify-center md:gap-8'>
						<div className='flex items-center gap-2'>
							<Phone size={16} />
							<span>+91 1234567890</span>
						</div>

						<div className='flex items-center gap-2'>
							<Mail size={16} />
							<span>hello@mamafarm.in</span>
						</div>
					</div>

					{/* Social Links */}
					<div className='mt-8 flex justify-center gap-4'>
						<Link href='#' className='rounded-full border border-white/15 p-3 transition hover:bg-white/10'>
							<Instagram size={20} />
						</Link>

						<Link href='#' className='rounded-full border border-white/15 p-3 transition hover:bg-white/10'>
							<Facebook size={20} />
						</Link>
					</div>

					{/* Divider */}
					<div className='my-10 border-t border-white/10' />

					{/* Copyright */}
					<div className='space-y-2'>
						<p className='text-sm text-white/60'>© {new Date().getFullYear()} Mamafarm. All rights reserved.</p>

						<p className='text-xs uppercase tracking-[0.3em] text-white/40'>Real Ingredients • Real Strength</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
