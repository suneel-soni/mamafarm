import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
	return (
		<footer className='relative overflow-hidden bg-gradient-to-b from-brand-green to-[#0f3d1f] text-white'>
			{/* Decorative Glow */}
			<div className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent' />

			<div className='container mx-auto px-4 py-16'>
				<div className='flex flex-col items-center text-center'>
					{/* Logo */}
					<div className='relative flex justify-center items-center'>
						<div className='absolute h-56 w-56 rounded-full bg-white/10 blur-3xl' />
						<div className='absolute h-40 w-40 rounded-full bg-white/20 blur-2xl' />
						<div className='absolute h-28 w-28 rounded-full bg-white/30 blur-xl' />

						<Image src='/images/mamafarm_logo.png' alt='Mamafarm Logo' width={280} height={120} className='relative z-10 h-24 md:h-32 w-auto' />
					</div>

					{/* Tagline */}
					<p className='mt-4 max-w-xl text-lg text-white/80'>Pure Ingredients. True Goodness.</p>

					<p className='mt-2 max-w-2xl text-white/60'>
						Bringing authentic farm goodness directly to your home with naturally sourced ingredients, traditional values, and a commitment to healthy living.
					</p>

					{/* Social Links */}
					<div className='mt-8 flex items-center gap-5'>
						<Link href='#' className='rounded-full border border-white/20 p-3 transition-all hover:border-white/50 hover:bg-white/10'>
							<Facebook size={20} />
						</Link>

						<Link href='#' className='rounded-full border border-white/20 p-3 transition-all hover:border-white/50 hover:bg-white/10'>
							<Instagram size={20} />
						</Link>

						<Link href='#' className='rounded-full border border-white/20 p-3 transition-all hover:border-white/50 hover:bg-white/10'>
							<Twitter size={20} />
						</Link>

						<Link href='#' className='rounded-full border border-white/20 p-3 transition-all hover:border-white/50 hover:bg-white/10'>
							<Youtube size={20} />
						</Link>
					</div>

					{/* Divider */}
					<div className='my-10 h-px w-full max-w-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent' />

					{/* Copyright */}
					<p className='text-sm text-white/60'>© {new Date().getFullYear()} Mamafarm. All rights reserved.</p>

					<p className='mt-2 text-xs tracking-widest uppercase text-white/40'>From Our Farm To Your Family</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
