import React from 'react';
import ShopDetailsClient from './ShopDetailsClient';

export async function generateStaticParams() {
  return [{ id: '1' }, { id: 'SHOP-101' }, { id: 'SHOP-102' }, { id: 'SHOP-103' }];
}

export default function ShopDetailsPage() {
  return <ShopDetailsClient />;
}
