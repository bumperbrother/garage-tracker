import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, LocationType } from '../../lib/types';
import { createBox, updateBox } from '../../lib/api';
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
} from '../ui';

interface BoxFormProps {
  box?: Box;
  categories?: string[];
  onSuccess?: (box: Box) => void;
}

// Define the form validation schema
const boxSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.enum(['Garage', 'Attic']),
  category: z.string().optional(),
  description: z.string().optional(),
});

type BoxFormValues = z.infer<typeof boxSchema>;

const BoxForm: React.FC<BoxFormProps> = ({ 
  box, 
  categories = [],
  onSuccess 
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!box;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BoxFormValues>({
    resolver: zodResolver(boxSchema),
    defaultValues: box ? {
      name: box.name,
      location: box.location,
      category: box.category || '',
      description: box.description || '',
    } : {
      location: 'Garage' as LocationType,
    },
  });

  const onSubmit = async (data: BoxFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let result;

      if (isEditing && box) {
        // Update existing box
        result = await updateBox(box.id, {
          name: data.name,
          location: data.location,
          category: data.category || null,
          description: data.description || null,
        });
      } else {
        // Create new box
        result = await createBox({
          name: data.name,
          location: data.location,
          category: data.category || null,
          description: data.description || null,
        });
      }

      if (onSuccess && result) {
        onSuccess(result);
      } else {
        // Navigate to the box detail page
        router.push(`/boxes/${result?.id}`);
      }
    } catch (err) {
      console.error('Error saving box:', err);
      setError(isEditing 
        ? 'Failed to update box. Please try again.' 
        : 'Failed to create box. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isEditing && box) {
      router.push(`/boxes/${box.id}`);
    } else {
      router.push('/boxes');
    }
  };

  // Prepare category options
  const categoryOptions = [
    ...categories.map(category => ({
      value: category,
      label: category,
    })),
  ];

  return (
    <div className="max-w-2xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Box' : 'Add New Box'}
      </h1>

      {error && (
        <div className="mb-6">
          <ErrorMessage title="Error" message={error} />
        </div>
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormSection>
          <FormField
            label="Box Name"
            htmlFor="name"
            error={errors.name?.message}
            required
          >
            <Input
              id="name"
              type="text"
              placeholder="Enter box name"
              fullWidth
              {...register('name')}
            />
          </FormField>

          <FormField
            label="Location"
            htmlFor="location"
            error={errors.location?.message}
            required
          >
            <Select
              id="location"
              options={[
                { value: 'Garage', label: 'Garage' },
                { value: 'Attic', label: 'Attic' },
              ]}
              emptyOption={null}
              fullWidth
              {...register('location')}
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
              placeholder="Enter box description (optional)"
              fullWidth
              {...register('description')}
            />
          </FormField>
        </FormSection>

        <FormActions>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            {isEditing ? 'Update Box' : 'Create Box'}
          </Button>
        </FormActions>
      </Form>
    </div>
  );
};

export default BoxForm;
