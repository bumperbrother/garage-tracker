import React, { useState } from 'react';
import { LocationType } from '../../lib/types';

interface SearchBarProps {
  onSearch: (query: string, filters: { location?: LocationType; category?: string }) => void;
  categories?: string[];
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  categories = [],
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState<LocationType | ''>('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filters: { location?: LocationType; category?: string } = {};
    
    if (location) {
      filters.location = location as LocationType;
    }
    
    if (category) {
      filters.category = category;
    }
    
    onSearch(query, filters);
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search for items..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value as LocationType | '')}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Locations</option>
            <option value="Garage">Garage</option>
            <option value="Attic">Attic</option>
          </select>
          
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
