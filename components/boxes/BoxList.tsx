import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '../../lib/types';
import { getBoxes, filterBoxesByLocation, filterBoxesByCategory } from '../../lib/api';
import { 
  Card, 
  CardGrid, 
  Button, 
  SearchBar, 
  Spinner, 
  EmptyState, 
  BoxesEmptyIcon,
  ErrorMessage,
  Pagination,
  Badge
} from '../ui';

interface BoxListProps {
  initialBoxes?: Box[];
  categories?: string[];
}

const BoxList: React.FC<BoxListProps> = ({ initialBoxes, categories = [] }) => {
  const router = useRouter();
  const [boxes, setBoxes] = useState<Box[]>(initialBoxes || []);
  const [filteredBoxes, setFilteredBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState(!initialBoxes);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const boxesPerPage = 12;

  useEffect(() => {
    if (!initialBoxes) {
      fetchBoxes();
    } else {
      setFilteredBoxes(initialBoxes);
    }
  }, [initialBoxes]);

  const fetchBoxes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBoxes();
      setBoxes(data);
      setFilteredBoxes(data);
    } catch (err) {
      setError('Failed to load boxes. Please try again.');
      console.error('Error fetching boxes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string, filters: { location?: string; category?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      let results: Box[] = [];
      
      // Apply location filter
      if (filters.location) {
        results = await filterBoxesByLocation(filters.location);
      } else {
        results = [...boxes];
      }
      
      // Apply category filter
      if (filters.category && results.length > 0) {
        results = results.filter(box => box.category === filters.category);
      }
      
      // Apply text search
      if (query) {
        const lowerQuery = query.toLowerCase();
        results = results.filter(
          box => 
            box.name.toLowerCase().includes(lowerQuery) || 
            (box.description && box.description.toLowerCase().includes(lowerQuery))
        );
      }
      
      setFilteredBoxes(results);
      setCurrentPage(1);
    } catch (err) {
      setError('Error searching boxes. Please try again.');
      console.error('Error searching boxes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBox = () => {
    router.push('/boxes/new');
  };

  const handleRetry = () => {
    fetchBoxes();
  };

  // Pagination
  const indexOfLastBox = currentPage * boxesPerPage;
  const indexOfFirstBox = indexOfLastBox - boxesPerPage;
  const currentBoxes = filteredBoxes.slice(indexOfFirstBox, indexOfLastBox);
  const totalPages = Math.ceil(filteredBoxes.length / boxesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  if (loading && !currentBoxes.length) {
    return (
      <div className="py-8">
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <ErrorMessage 
          title="Error Loading Boxes" 
          message={error} 
          onRetry={handleRetry} 
        />
      </div>
    );
  }

  if (!loading && !filteredBoxes.length) {
    return (
      <div className="py-8">
        <EmptyState
          title="No Boxes Found"
          description="You haven't added any boxes yet. Add your first box to start tracking your items."
          icon={<BoxesEmptyIcon />}
          action={{
            label: 'Add Box',
            onClick: handleAddBox,
          }}
        />
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Boxes</h1>
        <Button onClick={handleAddBox}>Add Box</Button>
      </div>

      <div className="mb-6">
        <SearchBar 
          onSearch={handleSearch} 
          categories={categories}
        />
      </div>

      <CardGrid columns={{ sm: 1, md: 2, lg: 3 }}>
        {currentBoxes.map((box) => (
          <Card
            key={box.id}
            title={box.name}
            subtitle={box.description || ''}
            href={`/boxes/${box.id}`}
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default BoxList;
