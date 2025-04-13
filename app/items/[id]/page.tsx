'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getItemById, getBoxById } from '../../../lib/api';
import { ItemWithImages, Box } from '../../../lib/types';
import ItemDetail from '../../../components/items/ItemDetail';
import Layout from '../../../components/layout/Layout';
import { Spinner, ErrorMessage } from '../../../components/ui';

export default function ItemDetailPage() {
  const params = useParams();
  const itemId = params.id as string;
  
  const [item, setItem] = useState<ItemWithImages | null>(null);
  const [box, setBox] = useState<Box | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch item
        const itemData = await getItemById(itemId);
        setItem(itemData);

        // Fetch box
        if (itemData?.box_id) {
          const boxData = await getBoxById(itemData.box_id);
          setBox(boxData);
        }
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Failed to load item. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchData();
    }
  }, [itemId]);

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
        <ItemDetail item={item} box={box || undefined} />
      ) : (
        <div className="py-8">
          <ErrorMessage title="Error" message="Item not found" />
        </div>
      )}
    </Layout>
  );
}
