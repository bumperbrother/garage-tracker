# Garage Tracker

A web application for tracking and organizing items stored in boxes in your garage and attic.

## Features

- **Box Management**: Create, edit, and delete boxes with location and category information
- **Item Tracking**: Add items to boxes with descriptions, photos, and barcodes
- **QR Code Generation**: Generate QR codes for boxes to quickly access their contents
- **Search Functionality**: Search for items and boxes by name, location, or category
- **Mobile-Friendly**: Responsive design works well on all devices
- **Camera Integration**: Take photos of items directly from the app
- **Barcode Scanning**: Scan barcodes to quickly identify items

## Tech Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage for images and QR codes
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/garage-tracker.git
   cd garage-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Set up the Supabase database tables:
   ```sql
   -- Create boxes table
   create table boxes (
     id uuid primary key default uuid_generate_v4(),
     name text not null,
     location text not null check (location in ('Garage', 'Attic')),
     category text,
     description text,
     created_at timestamp with time zone default now(),
     qr_code_id text unique not null
   );

   -- Create items table
   create table items (
     id uuid primary key default uuid_generate_v4(),
     name text not null,
     description text,
     box_id uuid references boxes(id) on delete cascade,
     category text,
     date_stored timestamp with time zone default now(),
     barcode text,
     created_at timestamp with time zone default now()
   );

   -- Create images table
   create table images (
     id uuid primary key default uuid_generate_v4(),
     item_id uuid references items(id) on delete cascade,
     storage_path text not null,
     created_at timestamp with time zone default now()
   );
   ```

5. Create storage buckets in Supabase:
   - `item-photos` for storing item images
   - `box-qrcodes` for storing QR codes

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app`: Next.js app router pages
- `/components`: React components
  - `/auth`: Authentication components
  - `/boxes`: Box-related components
  - `/home`: Home page components
  - `/items`: Item-related components
  - `/layout`: Layout components (header, footer)
  - `/search`: Search components
  - `/ui`: Reusable UI components
- `/lib`: Utility functions and API clients
  - `/api`: API functions for interacting with Supabase
  - `/types.ts`: TypeScript type definitions
  - `/auth.ts`: Authentication utilities
  - `/supabase.ts`: Supabase client
  - `/qrcode.ts`: QR code utilities
  - `/barcode.ts`: Barcode scanning utilities
- `/public`: Static assets

## Deployment

The application can be deployed to Vercel:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy

## License

This project is licensed under the MIT License - see the LICENSE file for details.
