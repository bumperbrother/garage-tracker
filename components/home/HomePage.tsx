import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Item } from '../../lib/types';
import { getBoxes } from '../../lib/api';
import { searchItems } from '../../lib/api';
import {
  Card,
  CardGrid,
  Button,
  SearchBar,
  Spinner,
  EmptyState,
  BoxesEmptyIcon,
  ErrorMessage,
  Badge,
} from '../ui';

interface HomePageProps {
  categories?: string[];
}

const HomePage: React.FC<HomePageProps> = ({ categories = [] }) => {
  const router = useRouter();
  const [recentBoxes, setRecentBoxes] = useState<Box[]>([]);
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch recent boxes
      const boxes = await getBoxes();
      setRecentBoxes(boxes.slice(0, 3)); // Get the 3 most recent boxes

      // Fetch recent items (in a real app, we'd have a dedicated API for this)
      const items = await searchItems('');
      setRecentItems(items.slice(0, 3)); // Get the 3 most recent items
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string, filters: { location?: string; category?: string }) => {
    // Construct the search URL with query parameters
    const searchParams = new URLSearchParams();
    
    if (query) {
      searchParams.append('q', query);
    }
    
    if (filters.location) {
      searchParams.append('location', filters.location);
    }
    
    if (filters.category) {
      searchParams.append('category', filters.category);
    }
    
    const searchUrl = `/search?${searchParams.toString()}`;
    router.push(searchUrl);
  };

  const handleBoxClick = (boxId: string) => {
    router.push(`/boxes/${boxId}`);
  };

  const handleItemClick = (itemId: string) => {
    router.push(`/items/${itemId}`);
  };

  const handleAddBox = () => {
    router.push('/boxes/new');
  };

  const handleViewAllBoxes = () => {
    router.push('/boxes');
  };

  const handleViewAllItems = () => {
    router.push('/items');
  };

  if (loading) {
    return (
      <div className="py-8 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <ErrorMessage
          title="Error"
          message={error}
          onRetry={fetchData}
        />
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Garage & Attic Inventory Tracker</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Keep track of all your items stored in boxes in your garage and attic.
          Easily search, categorize, and locate your belongings.
        </p>
      </div>

      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Search Your Inventory</h2>
          <SearchBar
            onSearch={handleSearch}
            categories={categories}
          />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Boxes</h2>
          <div className="flex space-x-2">
            <Button onClick={handleAddBox}>Add Box</Button>
            {recentBoxes.length > 0 && (
              <Button variant="outline" onClick={handleViewAllBoxes}>
                View All
              </Button>
            )}
          </div>
        </div>

        {recentBoxes.length === 0 ? (
          <EmptyState
            title="No Boxes Found"
            description="You haven't added any boxes yet. Add your first box to start tracking your items."
            icon={<BoxesEmptyIcon />}
            action={{
              label: 'Add Box',
              onClick: handleAddBox,
            }}
          />
        ) : (
          <CardGrid columns={{ sm: 1, md: 2, lg: 3 }}>
            {recentBoxes.map((box) => (
              <Card
                key={box.id}
                title={box.name}
                subtitle={box.description || ''}
                onClick={() => handleBoxClick(box.id)}
                footer={
                  <div className="flex justify-between items-center">
                    <Badge variant={box.location === 'Garage' ? 'primary' : 'info'} rounded>
                      {box.location}
                    </Badge>
                    {box.category && (
                      <Badge variant="secondary">
                        {box.category}
                      </Badge>
                    )}
                  </div>
                }
              />
            ))}
          </CardGrid>
        )}
      </div>

      {recentItems.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Items</h2>
            <Button variant="outline" onClick={handleViewAllItems}>
              View All
            </Button>
          </div>

          <CardGrid columns={{ sm: 1, md: 2, lg: 3 }}>
            {recentItems.map((item) => (
              <Card
                key={item.id}
                title={item.name}
                subtitle={item.description || ''}
                onClick={() => handleItemClick(item.id)}
                footer={
                  <div className="flex justify-between items-center">
                    {item.category && (
                      <Badge variant="secondary">
                        {item.category}
                      </Badge>
                    )}
                    <span className="text-sm text-gray-500">
                      {new Date(item.date_stored).toLocaleDateString()}
                    </span>
                  </div>
                }
              />
            ))}
          </CardGrid>
        </div>
      )}

      <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
        <h2 className="text-xl font-semibold mb-2">Quick Tips</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Use the search bar to quickly find items by name or category</li>
          <li>Scan QR codes on your boxes to instantly see what's inside</li>
          <li>Take photos of items to make them easier to identify</li>
          <li>Add detailed descriptions to help you remember important details</li>
          <li>Use categories to organize similar items across different boxes</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
