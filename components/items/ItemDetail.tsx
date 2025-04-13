import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ItemWithImages, Box } from '../../lib/types';
import { deleteItem } from '../../lib/api';
import { getImageUrl } from '../../lib/api/images';
import {
  Button,
  Badge,
  Modal,
  ModalFooter,
  Tabs,
  Spinner,
  ErrorMessage,
} from '../ui';

interface ItemDetailProps {
  item: ItemWithImages;
  box?: Box;
  onEdit?: () => void;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ item, box, onEdit }) => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      router.push(`/items/${item.id}/edit`);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteItem(item.id);
      setIsDeleteModalOpen(false);
      
      // Navigate back to the box detail page if we have a box
      if (box) {
        router.push(`/boxes/${box.id}`);
      } else {
        router.push('/items');
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleImageClick = (imagePath: string) => {
    setSelectedImage(getImageUrl(imagePath));
    setIsImageModalOpen(true);
  };

  const tabs = [
    {
      id: 'details',
      label: 'Details',
      content: (
        <div className="py-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{item.name}</dd>
              </div>
              
              {box && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Box</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/boxes/${box.id}`)}
                    >
                      {box.name}
                    </Button>
                  </dd>
                </div>
              )}
              
              {item.category && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <Badge variant="secondary">{item.category}</Badge>
                  </dd>
                </div>
              )}
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Date Stored</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(item.date_stored).toLocaleDateString()}
                </dd>
              </div>
              
              {item.barcode && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Barcode</dt>
                  <dd className="mt-1 text-sm text-gray-900">{item.barcode}</dd>
                </div>
              )}
              
              {item.description && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{item.description}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      ),
    },
    {
      id: 'photos',
      label: `Photos (${item.images?.length || 0})`,
      content: (
        <div className="py-4">
          {item.images && item.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {item.images.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-square overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => handleImageClick(image.storage_path)}
                >
                  <img
                    src={getImageUrl(image.storage_path)}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No photos available for this item.
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="py-6">
      {error && (
        <div className="mb-6">
          <ErrorMessage title="Error" message={error} />
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">{item.name}</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      <Tabs tabs={tabs} />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Item"
        footer={
          <ModalFooter
            onCancel={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
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

      {/* Image Modal */}
      <Modal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        title={item.name}
        size="lg"
      >
        {selectedImage && (
          <div className="flex justify-center">
            <img
              src={selectedImage}
              alt={item.name}
              className="max-w-full max-h-[70vh] object-contain"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ItemDetail;
