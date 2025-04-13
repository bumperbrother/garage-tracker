import React from 'react';
import Link from 'next/link';

interface CardProps {
  title: string;
  subtitle?: string;
  href?: string;
  image?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  href,
  image,
  footer,
  children,
  className = '',
  onClick,
}) => {
  const cardContent = (
    <>
      {image && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        {children && <div className="mt-3">{children}</div>}
      </div>
      {footer && <div className="border-t p-4">{footer}</div>}
    </>
  );

  const cardClasses = `bg-white rounded-lg shadow-md overflow-hidden group ${className}`;

  if (href) {
    return (
      <Link href={href} className={`${cardClasses} block hover:shadow-lg transition-shadow`}>
        {cardContent}
      </Link>
    );
  }

  return <div className={cardClasses} onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>{cardContent}</div>;
};

export default Card;
