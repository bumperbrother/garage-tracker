'use client';

import React, { Suspense } from 'react';
import Layout from '../../components/layout/Layout';
import { Spinner } from '../../components/ui';
import SearchPageContent from './SearchPageContent';

export default function SearchPage() {
  return (
    <Layout>
      <Suspense fallback={
        <div className="py-8 flex justify-center">
          <Spinner size="lg" />
        </div>
      }>
        <SearchPageContent />
      </Suspense>
    </Layout>
  );
}
