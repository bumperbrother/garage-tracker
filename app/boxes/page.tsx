'use client';

import React from 'react';
import BoxList from '../../components/boxes/BoxList';
import Layout from '../../components/layout/Layout';

export default function BoxesPage() {
  // In a real application, we would fetch categories from the API
  const categories = ['Camping', 'Christmas', 'Halloween', 'Kitchen', 'Tools', 'Clothes'];

  return (
    <Layout>
      <BoxList categories={categories} />
    </Layout>
  );
}
