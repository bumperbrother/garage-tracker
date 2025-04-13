'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getBoxes } from '../../../lib/api';
import { Box } from '../../../lib/types';
import ItemForm from '../../../components/items/ItemForm';
import Layout from '../../../components/layout/Layout';
import { Spinner, ErrorMessage } from '../../../components/ui';

export default function NewItemPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const boxId = searchParams.get('boxId');
  
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real application, we would fetch categories from the API
  const categories = ['Camping', 'Christmas', 'Halloween', 'Kitchen', 'Tools', 'Clothes'];

  useEffect(() => {
    const fetchBoxes = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getBoxes();
        setBoxes(data);
      } catch (err) {
        console.error('Error fetching boxes:', err);
        setError('Failed to load boxes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBoxes();
  }, []);

  return (
    <Layout>
      {loading ? (
        <div className="py-8 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="py-8">
          <ErrorMessage title="Error" message={error} />
        </div>
      ) : (
        <ItemForm 
          boxes={boxes} 
          categories={categories} 
          defaultBoxId={boxId || undefined} 
        />
      )}
    </Layout>
  );
}
