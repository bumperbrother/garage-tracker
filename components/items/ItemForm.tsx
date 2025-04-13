import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Item } from '../../lib/types';
import { createItem, updateItem } from '../../lib/api';
import {
  Form,
  FormSection,
  FormField,
  FormActions,
  Input,
  Select,
  Textarea,
  Button,
  ErrorMessage,
  FileUpload,
  Modal,
  Camera,
  QRCodeScanner,
} from '../ui';

interface ItemFormProps {
  item?: Item;
  boxes?: Box[];
  categories?: string[];
  defaultBoxId?: string;
  onSuccess?: (item: Item) => void;
}

// Define the form validation schema
const itemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  box_id: z.string().min(1, 'Box is required'),
  category: z.string().optional(),
  description: z.string().optional(),
  barcode: z.string().optional(),
});

type ItemFormValues = z.infer<typeof itemSchema>;

const ItemForm: React.FC<ItemFormProps> = ({
  item,
  boxes = [],
  categories = [],
  defaultBoxId,
  onSuccess,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const isEditing = !!item;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: item
      ? {
          name: item.name,
          box_id: item.box_id,
          category: item.category || '',
          description: item.description || '',
          barcode: item.barcode || '',
        }
      : {
          box_id: defaultBoxId || '',
        },
  });

  const onSubmit = async (data: ItemFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let result;

      if (isEditing && item) {
        // Update existing item
        result = await updateItem(item.id, {
          name: data.name,
          box_id: data.box_id,
          category: data.category || null,
          description: data.description || null,
          barcode: data.barcode || null,
        });
      } else {
        // Create new item
        result = await createItem({
          name: data.name,
          box_id: data.box_id,
          category: data.category || null,
          description: data.description || null,
          barcode: data.barcode || null,
          date_stored: new Date().toISOString(),
        });
      }

      // TODO: Handle file uploads for images
      // This would be implemented in a real application

      if (onSuccess && result) {
        onSuccess(result);
      } else {
        // Navigate to the item detail page
        router.push(`/items/${result?.id}`);
      }
    } catch (err) {
      console.error('Error saving item:', err);
      setError(
        isEditing
          ? 'Failed to update item. Please try again.'
          : 'Failed to create item. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isEditing && item) {
      router.push(`/items/${item.id}`);
    } else if (defaultBoxId) {
      router.push(`/boxes/${defaultBoxId}`);
    } else {
      router.push('/items');
    }
  };

  const handleCameraCapture = (imageSrc: string) => {
    // In a real application, you would convert the data URL to a File object
    // and add it to the selectedFiles state
    setIsCameraOpen(false);
  };

  const handleBarcodeScanned = (barcode: string) => {
    setValue('barcode', barcode);
    setIsQRScannerOpen(false);
  };

  const handleFileChange = (files: File[]) => {
    setSelectedFiles(files);
  };

  // Prepare box options
  const boxOptions = boxes.map((box) => ({
    value: box.id,
    label: box.name,
  }));

  // Prepare category options
  const categoryOptions = categories.map((category) => ({
    value: category,
    label: category,
  }));

  return (
    <div className="max-w-2xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Item' : 'Add New Item'}
      </h1>

      {error && (
        <div className="mb-6">
          <ErrorMessage title="Error" message={error} />
        </div>
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormSection>
          <FormField
            label="Item Name"
            htmlFor="name"
            error={errors.name?.message}
            required
          >
            <Input
              id="name"
              type="text"
              placeholder="Enter item name"
              fullWidth
              {...register('name')}
            />
          </FormField>

          <FormField
            label="Box"
            htmlFor="box_id"
            error={errors.box_id?.message}
            required
          >
            <Select
              id="box_id"
              options={boxOptions}
              emptyOption="Select a box"
              fullWidth
              {...register('box_id')}
            />
          </FormField>

          <FormField
            label="Category"
            htmlFor="category"
            error={errors.category?.message}
          >
            <Select
              id="category"
              options={categoryOptions}
              emptyOption="Select a category (optional)"
              fullWidth
              {...register('category')}
            />
          </FormField>

          <FormField
            label="Description"
            htmlFor="description"
            error={errors.description?.message}
          >
            <Textarea
              id="description"
              placeholder="Enter item description (optional)"
              fullWidth
              {...register('description')}
            />
          </FormField>

          <FormField
            label="Barcode"
            htmlFor="barcode"
            error={errors.barcode?.message}
          >
            <div className="flex space-x-2">
              <Input
                id="barcode"
                type="text"
                placeholder="Enter barcode (optional)"
                fullWidth
                {...register('barcode')}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsQRScannerOpen(true)}
              >
                Scan
              </Button>
            </div>
          </FormField>

          <FormField label="Photos" htmlFor="photos">
            <div className="space-y-4">
              <FileUpload
                id="photos"
                label="Upload Photos"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCameraOpen(true)}
              >
                Take Photo
              </Button>
            </div>
          </FormField>
        </FormSection>

        <FormActions>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditing ? 'Update Item' : 'Create Item'}
          </Button>
        </FormActions>
      </Form>

      {/* Camera Modal */}
      <Modal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        title="Take Photo"
      >
        <Camera
          onCapture={handleCameraCapture}
          onClose={() => setIsCameraOpen(false)}
        />
      </Modal>

      {/* QR/Barcode Scanner Modal */}
      <Modal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        title="Scan Barcode"
      >
        <QRCodeScanner
          onScan={handleBarcodeScanned}
          onClose={() => setIsQRScannerOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ItemForm;
