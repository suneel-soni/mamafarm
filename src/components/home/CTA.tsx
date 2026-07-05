'use client';

import { motion } from 'framer-motion';
import { Phone, ShoppingBag } from 'lucide-react';

export default function CTA() {
	return (
		<section className='bg-white py-16 lg:py-24' id='cta'>
			<div className='container mx-auto px-4 max-w-5xl'>
				<motion.div
					initial={{ opacity: 0, y: 40, scale: 0.98 }}
					whileInView={{ opacity: 1, y: 0, scale: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, type: 'spring', stiffness: 70 }}
					className='relative bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#124214] rounded-3xl overflow-hidden shadow-2xl py-14 px-8 md:py-20 md:px-16 text-center text-white border border-brand-green/20'
				>
					{/* Glowing decorative ambient background blur elements */}
					<div className='absolute -top-32 -left-32 w-96 h-96 bg-[#C6922F]/15 rounded-full blur-3xl' />
					<div className='absolute -bottom-32 -right-32 w-96 h-96 bg-[#FFF8EE]/10 rounded-full blur-3xl' />

					{/* Content */}
					<div className='relative z-10 max-w-3xl mx-auto'>
						<motion.span
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.1 }}
							className='inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md text-[#FFF8EE] rounded-full text-xs md:text-sm font-bold tracking-wider uppercase mb-6 border border-white/10'
						>
							Order Freshly Prepared Laddus
						</motion.span>
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className='text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight font-serif tracking-wide text-[#FFF8EE]'
						>
							Bring Home the Taste <br />
							<span className='text-[#C6922F] italic font-normal'>of Tradition</span>
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className='text-white/80 text-base md:text-lg lg:text-xl mb-10 leading-relaxed font-light'
						>
							Experience handcrafted Desi Ghee Besan Laddus made using premium ingredients and traditional recipes. Prepared fresh and made with care for your family.
						</motion.p>

						{/* CTA Buttons */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className='flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6'
						>
							{/* Whatsapp Order / Contact Button */}
							<a
								href='https://wa.me/918130188878?text=I%20want%20to%20order%20MamaFarm%20Desi%20Ghee%20Besan%20Laddus'
								target='_blank'
								rel='noopener noreferrer'
								className='w-full sm:w-auto bg-[#C6922F] hover:bg-[#b08125] text-[#FFF8EE] font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 group'
							>
								<ShoppingBag className='w-5 h-5 group-hover:scale-110 transition-transform' />
								<span>Order Now</span>
							</a>

							{/* Phone Call Button */}
							<a
								href='tel:8130188878'
								className='w-full sm:w-auto bg-white/10 hover:bg-white/20 text-[#FFF8EE] font-bold py-4 px-8 rounded-full border border-white/20 shadow-md backdrop-blur-md active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 group'
							>
								<Phone className='w-5 h-5 group-hover:animate-wiggle' />
								<span>Call Now: 8130188878</span>
							</a>
						</motion.div>

						{/* Licensing/FSSAI Info footer */}
						<motion.p
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.5 }}
							className='mt-10 text-xs text-white/50 tracking-widest uppercase font-mono'
						>
							FSSAI LIC. NO: 21226188002092
						</motion.p>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
