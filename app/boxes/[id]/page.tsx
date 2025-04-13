'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getBoxById } from '../../../lib/api';
import { BoxWithItems } from '../../../lib/types';
import BoxDetail from '../../../components/boxes/BoxDetail';
import Layout from '../../../components/layout/Layout';
import { Spinner, ErrorMessage } from '../../../components/ui';

export default function BoxDetailPage() {
  const params = useParams();
  const boxId = params.id as string;
  
  const [box, setBox] = useState<BoxWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <BoxDetail box={box} />
      ) : (
        <div className="py-8">
          <ErrorMessage title="Error" message="Box not found" />
        </div>
      )}
    </Layout>
  );
}
