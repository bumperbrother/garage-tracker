'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getBoxes, getItems } from '../../lib/api';
import { Box, Item } from '../../lib/types';
import ItemList from '../../components/items/ItemList';
import Layout from '../../components/layout/Layout';
import { Button, Spinner, ErrorMessage } from '../../components/ui';

export default function ItemsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getItems();
        setItems(data);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to load items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleAddItem = () => {
    router.push('/items/new');
  };

  return (
    <Layout>
      <div className="py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">All Items</h1>
          <Button onClick={handleAddItem}>Add Item</Button>
        </div>

        {loading ? (
          <div className="py-8 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="py-8">
            <ErrorMessage title="Error" message={error} />
          </div>
        ) : (
          <ItemList items={items} />
        )}
      </div>
    </Layout>
  );
}
