'use client';

import React, { Suspense } from 'react';
import Layout from '../../../components/layout/Layout';
import { Spinner } from '../../../components/ui';
import NewItemContent from './NewItemContent';

export default function NewItemPage() {
  return (
    <Layout>
      <Suspense fallback={
        <div className="py-8 flex justify-center">
          <Spinner size="lg" />
        </div>
      }>
        <NewItemContent />
      </Suspense>
    </Layout>
  );
}
