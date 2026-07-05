'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { faqData } from '../../data/home';

export default function Faq() {
	const [activeId, setActiveId] = useState<string | null>(null);

	const toggleFaq = (id: string) => {
		setActiveId((prev) => (prev === id ? null : id));
	};

	return (
		<section className='bg-brand-cream py-20 lg:py-28' id='faq'>
			<div className='container mx-auto px-4 max-w-4xl'>
				{/* Section Header */}
				<div className='text-center max-w-2xl mx-auto mb-16'>
					<motion.span
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className='inline-block px-4 py-1.5 bg-brand-green/10 text-brand-green rounded-full text-sm font-semibold tracking-wide uppercase mb-4'
					>
						Got Questions?
					</motion.span>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className='text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-green mb-6'
					>
						Frequently Asked Questions
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className='text-gray-600 text-base md:text-lg'
					>
						Find answers to common questions about our ingredients, preparation, storage, and orders.
					</motion.p>
				</div>

				{/* Accordion List */}
				<div className='space-y-4 max-w-3xl mx-auto'>
					{faqData.map((faq, index) => {
						const isOpen = activeId === faq.id;

						return (
							<motion.div
								key={faq.id}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.05 * index }}
								className='bg-white rounded-2xl border border-brand-green/5 overflow-hidden shadow-sm hover:shadow-md transition-shadow'
							>
								{/* Accordion Trigger Header */}
								<button
									onClick={() => toggleFaq(faq.id)}
									className='w-full text-left px-6 py-5 md:px-8 md:py-6 flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2'
									aria-expanded={isOpen}
									aria-controls={`faq-answer-${faq.id}`}
									id={`faq-button-${faq.id}`}
								>
									<span className='flex items-center gap-3.5'>
										<HelpCircle className='w-5 h-5 text-brand-wheat flex-shrink-0' />
										<span className='font-bold text-brand-green text-base md:text-lg leading-snug'>
											{faq.question}
										</span>
									</span>
									<motion.div
										animate={{ rotate: isOpen ? 180 : 0 }}
										transition={{ duration: 0.3, ease: 'easeInOut' }}
										className='flex-shrink-0 w-8 h-8 rounded-full bg-brand-cream flex items-center justify-center text-brand-green border border-brand-green/5'
									>
										<ChevronDown className='w-4 h-4' />
									</motion.div>
								</button>

								{/* Accordion Panel Body */}
								<AnimatePresence initial={false}>
									{isOpen && (
										<motion.div
											id={`faq-answer-${faq.id}`}
											role='region'
											aria-labelledby={`faq-button-${faq.id}`}
											initial={{ height: 0, opacity: 0 }}
											animate={{
												height: 'auto',
												opacity: 1,
												transition: {
													height: { duration: 0.3, ease: 'easeOut' },
													opacity: { duration: 0.2, delay: 0.1 },
												},
											}}
											exit={{
												height: 0,
												opacity: 0,
												transition: {
													height: { duration: 0.3, ease: 'easeIn' },
													opacity: { duration: 0.15 },
												},
											}}
										>
											<div className='px-6 pb-6 md:px-8 md:pb-8 pt-0 border-t border-brand-cream text-gray-600 text-sm md:text-base leading-relaxed pl-14 md:pl-16'>
												{faq.answer}
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
