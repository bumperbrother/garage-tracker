'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import SearchResults from '../../components/search/SearchResults';
import Layout from '../../components/layout/Layout';
import { LocationType } from '../../lib/types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const location = searchParams.get('location') as LocationType | null;
  const category = searchParams.get('category') || '';

  // In a real application, we would fetch categories from the API
  const categories = ['Camping', 'Christmas', 'Halloween', 'Kitchen', 'Tools', 'Clothes'];

  return (
    <Layout>
      <SearchResults
        initialQuery={query}
        initialLocation={location || undefined}
        initialCategory={category || undefined}
        categories={categories}
      />
    </Layout>
  );
}
