import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Item, LocationType } from '../../lib/types';
import { searchBoxes, searchItems } from '../../lib/api';
import {
  Card,
  CardGrid,
  Button,
  SearchBar,
  Spinner,
  EmptyState,
  SearchEmptyIcon,
  ErrorMessage,
  Badge,
  Tabs,
} from '../ui';

interface SearchResultsProps {
  initialQuery?: string;
  initialLocation?: LocationType;
  initialCategory?: string;
  categories?: string[];
}

const SearchResults: React.FC<SearchResultsProps> = ({
  initialQuery = '',
  initialLocation,
  initialCategory,
  categories = [],
}) => {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState<LocationType | undefined>(initialLocation);
  const [category, setCategory] = useState<string | undefined>(initialCategory);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (initialQuery || initialLocation || initialCategory) {
      performSearch(initialQuery, {
        location: initialLocation,
        category: initialCategory,
      });
    }
  }, [initialQuery, initialLocation, initialCategory]);

  const performSearch = async (
    searchQuery: string,
    filters: { location?: LocationType; category?: string }
  ) => {
    setLoading(true);
    setError(null);
    setQuery(searchQuery);
    setLocation(filters.location);
    setCategory(filters.category);

    try {
      // Search boxes
      const boxResults = await searchBoxes(searchQuery);
      
      // Filter boxes by location and category if specified
      let filteredBoxes = boxResults;
      if (filters.location) {
        filteredBoxes = filteredBoxes.filter(box => box.location === filters.location);
      }
      if (filters.category) {
        filteredBoxes = filteredBoxes.filter(box => box.category === filters.category);
      }
      
      setBoxes(filteredBoxes);

      // Search items
      const itemResults = await searchItems(searchQuery);
      
      // Filter items by category if specified
      let filteredItems = itemResults;
      if (filters.category) {
        filteredItems = filteredItems.filter(item => item.category === filters.category);
      }
      
      setItems(filteredItems);
    } catch (err) {
      console.error('Error performing search:', err);
      setError('Failed to perform search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery: string, filters: { location?: LocationType; category?: string }) => {
    performSearch(searchQuery, filters);
  };

  const handleBoxClick = (box: Box) => {
    router.push(`/boxes/${box.id}`);
  };

  const handleItemClick = (item: Item) => {
    router.push(`/items/${item.id}`);
  };

  const getTotalResults = () => {
    if (activeTab === 'all') {
      return boxes.length + items.length;
    } else if (activeTab === 'boxes') {
      return boxes.length;
    } else {
      return items.length;
    }
  };

  const renderResults = () => {
    const totalResults = getTotalResults();

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
            onRetry={() => performSearch(query, { location, category })}
          />
        </div>
      );
    }

    if (totalResults === 0) {
      return (
        <EmptyState
          title="No Results Found"
          description={`No ${activeTab === 'boxes' ? 'boxes' : activeTab === 'items' ? 'items' : 'items or boxes'} match your search criteria.`}
          icon={<SearchEmptyIcon />}
        />
      );
    }

    if (activeTab === 'all' || activeTab === 'boxes') {
      if (boxes.length > 0 && activeTab === 'all') {
        return (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Boxes ({boxes.length})</h2>
            <CardGrid columns={{ sm: 1, md: 2, lg: 3 }}>
              {boxes.map((box) => (
                <Card
                  key={box.id}
                  title={box.name}
                  subtitle={box.description || ''}
                  onClick={() => handleBoxClick(box)}
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
          </div>
        );
      }

      if (boxes.length > 0 && activeTab === 'boxes') {
        return (
          <CardGrid columns={{ sm: 1, md: 2, lg: 3 }}>
            {boxes.map((box) => (
              <Card
                key={box.id}
                title={box.name}
                subtitle={box.description || ''}
                onClick={() => handleBoxClick(box)}
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
        );
      }
    }

    if (activeTab === 'all' || activeTab === 'items') {
      if (items.length > 0 && activeTab === 'all') {
        return (
          <div>
            {boxes.length > 0 && <h2 className="text-xl font-semibold mb-4">Items ({items.length})</h2>}
            <CardGrid columns={{ sm: 1, md: 2, lg: 3 }}>
              {items.map((item) => (
                <Card
                  key={item.id}
                  title={item.name}
                  subtitle={item.description || ''}
                  onClick={() => handleItemClick(item)}
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
        );
      }

      if (items.length > 0 && activeTab === 'items') {
        return (
          <CardGrid columns={{ sm: 1, md: 2, lg: 3 }}>
            {items.map((item) => (
              <Card
                key={item.id}
                title={item.name}
                subtitle={item.description || ''}
                onClick={() => handleItemClick(item)}
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
        );
      }
    }

    return null;
  };

  const tabs = [
    {
      id: 'all',
      label: `All (${boxes.length + items.length})`,
      content: renderResults(),
    },
    {
      id: 'boxes',
      label: `Boxes (${boxes.length})`,
      content: renderResults(),
    },
    {
      id: 'items',
      label: `Items (${items.length})`,
      content: renderResults(),
    },
  ];

  return (
    <div className="py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Search</h1>
        <SearchBar
          onSearch={handleSearch}
          categories={categories}
        />
      </div>

      {query || location || category ? (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
            <span>Results for:</span>
            {query && <Badge variant="primary">{query}</Badge>}
            {location && <Badge variant="info">{location}</Badge>}
            {category && <Badge variant="secondary">{category}</Badge>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => performSearch('', {})}
            >
              Clear
            </Button>
          </div>
        </div>
      ) : null}

      <Tabs
        tabs={tabs}
        defaultTabId="all"
        onChange={(tabId) => setActiveTab(tabId)}
      />
    </div>
  );
};

export default SearchResults;
