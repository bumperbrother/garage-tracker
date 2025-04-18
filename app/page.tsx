'use client';

import React from 'react';
import HomePage from '../components/home/HomePage';
import Layout from '../components/layout/Layout';

export default function Home() {
  // In a real application, we would fetch categories from the API
  const categories = ['Camping', 'Christmas', 'Halloween', 'Kitchen', 'Tools', 'Clothes'];

  return (
    <Layout>
      <HomePage categories={categories} />
    </Layout>
  );
}
