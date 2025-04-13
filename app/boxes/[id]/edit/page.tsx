'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBoxById } from '../../../../lib/api';
import { Box } from '../../../../lib/types';
import BoxForm from '../../../../components/boxes/BoxForm';
import Layout from '../../../../components/layout/Layout';
import { Spinner, ErrorMessage } from '../../../../components/ui';

export default function EditBoxPage() {
  const params = useParams();
  const router = useRouter();
  const boxId = params.id as string;
  
  const [box, setBox] = useState<Box | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real application, we would fetch categories from the API
  const categories = ['Camping', 'Christmas', 'Halloween', 'Kitchen', 'Tools', 'Clothes'];

  useEffect(() => {
    const fetchBox = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getBoxById(boxId);
        setBox(data);
      } catch (err) {
        console.error('Error fetching box:', err);
        setError('Failed to load box. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (boxId) {
      fetchBox();
    }
  }, [boxId]);

  const handleSuccess = (updatedBox: Box) => {
    router.push(`/boxes/${updatedBox.id}`);
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
      ) : box ? (
        <BoxForm box={box} categories={categories} onSuccess={handleSuccess} />
      ) : (
        <div className="py-8">
          <ErrorMessage title="Error" message="Box not found" />
        </div>
      )}
    </Layout>
  );
}
