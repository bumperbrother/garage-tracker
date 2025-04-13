'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getItemById, getBoxes } from '../../../../lib/api';
import { Item, Box } from '../../../../lib/types';
import ItemForm from '../../../../components/items/ItemForm';
import Layout from '../../../../components/layout/Layout';
import { Spinner, ErrorMessage } from '../../../../components/ui';

export default function EditItemPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;
  
  const [item, setItem] = useState<Item | null>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real application, we would fetch categories from the API
  const categories = ['Camping', 'Christmas', 'Halloween', 'Kitchen', 'Tools', 'Clothes'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch item
        const itemData = await getItemById(itemId);
        setItem(itemData);

        // Fetch boxes
        const boxesData = await getBoxes();
        setBoxes(boxesData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchData();
    }
  }, [itemId]);

  const handleSuccess = (updatedItem: Item) => {
    router.push(`/items/${updatedItem.id}`);
  };

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
      ) : item ? (
        <ItemForm 
          item={item} 
          boxes={boxes} 
          categories={categories} 
          onSuccess={handleSuccess} 
        />
      ) : (
        <div className="py-8">
          <ErrorMessage title="Error" message="Item not found" />
        </div>
      )}
    </Layout>
  );
}
