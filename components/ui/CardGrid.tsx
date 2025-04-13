import React, { ReactNode } from 'react';

interface CardGridProps {
  children: ReactNode;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CardGrid: React.FC<CardGridProps> = ({
  children,
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'md',
  className = '',
}) => {
  // Convert column numbers to Tailwind grid classes
  const getColumnClass = () => {
    const colClasses = [];
    
    if (columns.sm) {
      colClasses.push(`grid-cols-${columns.sm}`);
    } else {
      colClasses.push('grid-cols-1');
    }
    
    if (columns.md) {
      colClasses.push(`md:grid-cols-${columns.md}`);
    }
    
    if (columns.lg) {
      colClasses.push(`lg:grid-cols-${columns.lg}`);
    }
    
    if (columns.xl) {
      colClasses.push(`xl:grid-cols-${columns.xl}`);
    }
    
    return colClasses.join(' ');
  };
  
  // Convert gap size to Tailwind gap classes
  const getGapClass = () => {
    switch (gap) {
      case 'sm':
        return 'gap-3';
      case 'lg':
        return 'gap-6';
      case 'md':
      default:
        return 'gap-4';
    }
  };

  return (
    <div className={`grid ${getColumnClass()} ${getGapClass()} ${className}`}>
      {children}
    </div>
  );
};

export default CardGrid;
