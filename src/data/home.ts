import {
	FeatureCard,
	Ingredient,
	ProcessStep,
	OccasionCard,
	PromiseCard,
	FaqItem,
} from '../types/home';

export const whyChooseData: FeatureCard[] = [
	{
		id: 'ghee',
		iconName: 'Sparkles',
		title: 'Premium Desi Ghee',
		description: 'Made with 100% pure, aromatic Desi Ghee that melts in your mouth and offers a rich, heavenly taste.',
	},
	{
		id: 'tradition',
		iconName: 'BookOpen',
		title: 'Traditional Recipe',
		description: 'Passed down through generations, our recipe ensures the authentic, slow-roasted nutty flavor.',
	},
	{
		id: 'fresh',
		iconName: 'Flame',
		title: 'Freshly Prepared',
		description: 'Handcrafted in small batches to guarantee maximum freshness, rich aroma, and premium quality.',
	},
	{
		id: 'ingredients',
		iconName: 'Leaf',
		title: 'Premium Ingredients',
		description: 'Sourced from the finest farms—premium gram flour, handpicked dry fruits, and pure cardamom.',
	},
];

export const ingredientsData: Ingredient[] = [
	{
		id: 'ghee',
		name: 'Desi Ghee',
		image: '/images/desi-ghee.jpg',
		description: 'Pure, rich Desi Ghee for a signature melt-in-your-mouth texture and authentic aroma.',
	},
	{
		id: 'besan',
		name: 'Premium Besan',
		image: '/images/besan.jpg',
		description: 'Finely ground gram flour, slow-roasted perfectly to create a rich, nutty golden base.',
	},
	{
		id: 'sugar',
		name: 'Sugar',
		image: '/images/sugar.jpg',
		description: 'Precisely balanced sweetness to complement the rich ghee and roasted flour flavors.',
	},
	{
		id: 'cashew',
		name: 'Cashew (Kaju)',
		image: '/images/cashew.jpg',
		description: 'Premium buttery cashews chopped and mixed in to provide a delightful crunch.',
	},
	{
		id: 'almond',
		name: 'Almond (Badam)',
		image: '/images/almond.jpg',
		description: 'Finest quality nutritious almonds sliced beautifully for a wholesome crunch.',
	},
	{
		id: 'seeds',
		name: 'Cucumber Seeds',
		image: '/images/seeds.jpg',
		description: 'Traditional Magaj seeds that add a unique, authentic texture and health benefits.',
	},
	{
		id: 'elaichi',
		name: 'Elaichi Powder',
		image: '/images/elaichi-powder.jpg',
		description: 'Freshly ground cardamom powder imparting an enchanting sweet and spice aroma.',
	},
];

export const whyUsChecklist: string[] = [
	'Pure Desi Ghee',
	'Slow Roasted Besan',
	'Premium Dry Fruits',
	'Handmade',
	'Freshly Packed',
	'Authentic Taste',
];

export const processSteps: ProcessStep[] = [
	{
		id: 1,
		title: 'Premium Ingredients',
		description: 'We source pure aromatic Desi Ghee, premium grade gram flour, and handpicked dry fruits.',
	},
	{
		id: 2,
		title: 'Slow Roasting',
		description: 'Gram flour is slow-roasted over a gentle, controlled flame until it turns golden-brown and aromatic.',
	},
	{
		id: 3,
		title: 'Mix with Desi Ghee',
		description: 'Warm roasted besan is blended with a generous amount of warm, fragrant pure Desi Ghee.',
	},
	{
		id: 4,
		title: 'Add Dry Fruits',
		description: 'We fold in crunchy cashews, premium sliced almonds, and traditional cucumber seeds.',
	},
	{
		id: 5,
		title: 'Elaichi Powder',
		description: 'Freshly ground premium cardamom powder is added to lock in the classic sweet aroma.',
	},
	{
		id: 6,
		title: 'Handcrafted Laddus',
		description: 'Each laddu is gently rolled and shaped by hand by skilled artisans to preserve texture.',
	},
	{
		id: 7,
		title: 'Fresh Packaging',
		description: 'Securely sealed immediately in premium food-grade packaging to keep freshness intact.',
	},
];

export const occasionsData: OccasionCard[] = [
	{
		id: 'festivals',
		title: 'Festivals',
		description: 'Add authentic sweetness to Diwali, Holi, Rakhi, and your auspicious celebrations.',
		iconName: 'Sparkles',
	},
	{
		id: 'corporate',
		title: 'Corporate Gifts',
		description: 'Delight your clients, partners, and employees with premium, handcrafted tradition.',
		iconName: 'Briefcase',
	},
	{
		id: 'family',
		title: 'Family Gatherings',
		description: 'Share a sweet trip down memory lane with the warm, rich taste of pure family love.',
		iconName: 'Users',
	},
	{
		id: 'birthday',
		title: 'Birthday Gifts',
		description: 'Give a unique, nourishing, and delicious sweet gift that stands out from the rest.',
		iconName: 'Gift',
	},
	{
		id: 'office',
		title: 'Office Celebrations',
		description: 'Elevate your office milestones, project completions, and team successes with sweet joy.',
		iconName: 'Building',
	},
	{
		id: 'daily',
		title: 'Daily Sweet Cravings',
		description: 'Indulge in a pure, nutrient-packed sweet treat for yourself and your children guilt-free.',
		iconName: 'Heart',
	},
];

export const promiseData: PromiseCard[] = [
	{
		id: 'premium-ing',
		title: 'Premium Ingredients',
		description: 'Only the highest grade of ghee, besan, and dry fruits make it to our kitchen.',
		iconName: 'CheckCircle',
	},
	{
		id: 'trad-recipe',
		title: 'Traditional Recipe',
		description: 'Authentic methods of slow-roasting and manual rolling are never compromised.',
		iconName: 'Scroll',
	},
	{
		id: 'fresh-prep',
		title: 'Freshly Prepared',
		description: 'Made in small, meticulously controlled batches to ensure supreme freshness.',
		iconName: 'Flame',
	},
	{
		id: 'qual-check',
		title: 'Quality Checked',
		description: 'Rigorous hygiene and standard checks at every step of preparation and packing.',
		iconName: 'ShieldCheck',
	},
	{
		id: 'no-flavors',
		title: 'No Artificial Flavours',
		description: 'Zero chemical additives, colors, or artificial flavorings are ever used.',
		iconName: 'HeartHandshake',
	},
	{
		id: 'made-care',
		title: 'Made with Care',
		description: 'Crafted with absolute dedication and hygienic standards for every family.',
		iconName: 'Smile',
	},
];

export const faqData: FaqItem[] = [
	{
		id: 'faq-1',
		question: 'Is it made using Desi Ghee?',
		answer: 'Yes, absolutely. Our Laddus are prepared using 100% pure and aromatic Desi Ghee. We never use vegetable oil, palm oil, hydrogenated fats, or margarine.',
	},
	{
		id: 'faq-2',
		question: 'Does it contain Dry Fruits?',
		answer: 'Yes, every laddu is packed with premium quality hand-chopped cashews (kaju), sliced almonds (badam), and traditional cucumber seeds (magaj) to add a nutritious crunch to every single bite.',
	},
	{
		id: 'faq-3',
		question: 'How should I store it?',
		answer: 'Store them in a cool, dry place inside an airtight container. Keep them away from direct sunlight. There is no need to refrigerate them, as keeping them in the fridge can make the ghee harden and change the texture.',
	},
	{
		id: 'faq-4',
		question: 'What is the shelf life?',
		answer: 'Our Laddus have a shelf life of up to 30 days from the date of preparation, provided they are kept in an airtight container in dry conditions. Since we do not add preservatives, we recommend consuming them fresh.',
	},
	{
		id: 'faq-5',
		question: 'Do you accept bulk or corporate orders?',
		answer: 'Yes! We specialize in premium gifting for festivals, corporate events, weddings, and special family gatherings. We offer customizable packaging. Please call us at 8130188878 to discuss your needs.',
	},
];
