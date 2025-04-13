import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BoxWithItems } from '../../lib/types';
import { deleteBox } from '../../lib/api';
import { getBoxUrl } from '../../lib/qrcode';
import {
  Button,
  Badge,
  Modal,
  ModalFooter,
  Tabs,
  QRCodeDisplay,
  Spinner,
  ErrorMessage,
} from '../ui';
import ItemList from '../items/ItemList';

interface BoxDetailProps {
  box: BoxWithItems;
  onEdit?: () => void;
}

const BoxDetail: React.FC<BoxDetailProps> = ({ box, onEdit }) => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      router.push(`/boxes/${box.id}/edit`);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteBox(box.id);
      setIsDeleteModalOpen(false);
      router.push('/boxes');
    } catch (err) {
      console.error('Error deleting box:', err);
      setError('Failed to delete box. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleAddItem = () => {
    router.push(`/items/new?boxId=${box.id}`);
  };

  const handleShowQRCode = () => {
    setIsQRModalOpen(true);
  };

  const boxUrl = getBoxUrl(box.id);

  const tabs = [
    {
      id: 'items',
      label: `Items (${box.items?.length || 0})`,
      content: (
        <div className="py-4">
          <div className="flex justify-end mb-4">
            <Button onClick={handleAddItem}>Add Item</Button>
          </div>
          <ItemList items={box.items || []} boxId={box.id} />
        </div>
      ),
    },
    {
      id: 'details',
      label: 'Details',
      content: (
        <div className="py-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{box.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <Badge
                    variant={box.location === 'Garage' ? 'primary' : 'info'}
                    rounded
                  >
                    {box.location}
                  </Badge>
                </dd>
              </div>
              {box.category && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <Badge variant="secondary">{box.category}</Badge>
                  </dd>
                </div>
              )}
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Date Added</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(box.created_at).toLocaleDateString()}
                </dd>
              </div>
              {box.description && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{box.description}</dd>
                </div>
              )}
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">QR Code</dt>
                <dd className="mt-1">
                  <Button variant="outline" size="sm" onClick={handleShowQRCode}>
                    Show QR Code
                  </Button>
                </dd>
              </div>
            </dl>
          </div>
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
        <h1 className="text-2xl font-bold">{box.name}</h1>
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
        title="Delete Box"
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
          Are you sure you want to delete this box? This will also delete all items
          associated with this box. This action cannot be undone.
        </p>
      </Modal>

      {/* QR Code Modal */}
      <Modal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        title="Box QR Code"
      >
        <div className="flex flex-col items-center">
          <QRCodeDisplay
            value={boxUrl}
            title={box.name}
            description="Scan this QR code to quickly access this box's contents."
          />
        </div>
      </Modal>
    </div>
  );
};

export default BoxDetail;
