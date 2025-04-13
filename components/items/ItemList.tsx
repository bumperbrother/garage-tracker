import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Item } from '../../lib/types';
import { deleteItem } from '../../lib/api';
import {
  Card,
  CardGrid,
  Button,
  Badge,
  Modal,
  ModalFooter,
  EmptyState,
  ItemsEmptyIcon,
  ErrorMessage,
} from '../ui';

interface ItemListProps {
  items: Item[];
  boxId?: string;
  showBoxInfo?: boolean;
}

const ItemList: React.FC<ItemListProps> = ({
  items,
  boxId,
  showBoxInfo = false,
}) => {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleViewItem = (item: Item) => {
    router.push(`/items/${item.id}`);
  };

  const handleEditItem = (item: Item, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/items/${item.id}/edit`);
  };

  const handleDeleteClick = (item: Item, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteItem(selectedItem.id);
      setIsDeleteModalOpen(false);
      
      // Refresh the page to show updated list
      window.location.reload();
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddItem = () => {
    if (boxId) {
      router.push(`/items/new?boxId=${boxId}`);
    } else {
      router.push('/items/new');
    }
  };

  if (items.length === 0) {
    return (
      <EmptyState
        title="No Items Found"
        description={boxId 
          ? "This box doesn't have any items yet. Add your first item to start tracking."
          : "You haven't added any items yet. Add your first item to start tracking."
        }
        icon={<ItemsEmptyIcon />}
        action={{
          label: 'Add Item',
          onClick: handleAddItem,
        }}
      />
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-6">
          <ErrorMessage title="Error" message={error} />
        </div>
      )}

      <CardGrid columns={{ sm: 1, md: 2, lg: 3 }}>
        {items.map((item) => (
          <Card
            key={item.id}
            title={item.name}
            subtitle={item.description || ''}
            onClick={() => handleViewItem(item)}
            footer={
              <div className="flex justify-between items-center">
                {item.category && (
                  <Badge variant="secondary">
                    {item.category}
                  </Badge>
                )}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleEditItem(item, e)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={(e) => handleDeleteClick(item, e)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            }
          />
        ))}
      </CardGrid>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Item"
        footer={
          <ModalFooter
            onCancel={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteItem}
            cancelText="Cancel"
            confirmText="Delete"
            isLoading={isDeleting}
            danger
          />
        }
      >
        <p>
          Are you sure you want to delete this item? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default ItemList;
