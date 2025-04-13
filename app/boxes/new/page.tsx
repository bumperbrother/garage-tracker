'use client';

import React from 'react';
import BoxForm from '../../../components/boxes/BoxForm';
import Layout from '../../../components/layout/Layout';

export default function NewBoxPage() {
  // In a real application we would fetch categories from the API
  const categories = ['Camping', 'Christmas', 'Halloween', 'Kitchen', 'Tools', 'Clothes'];

  return (
    <Layout>
      <BoxForm categories={categories} />
    </Layout>
  );
}
