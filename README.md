# Product Management Web App

A product management dashboard built with Next.js 16, TypeScript, and Firebase Firestore.

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Redux Toolkit (RTK Query)
- **Real-time Database**: Firebase Firestore
- **Form Handling**: React Hook Form + Zod
- **Notifications**: Sonner
- **Icons**: Lucide React

## Features

- **Real-time Product Management**: Add, edit, delete products with instant Firebase sync
- **Category Management**: Organize products with categories
- **Image Upload**: Multiple image support
- **Authentication**: JWT token based authentication 
- **Responsive Design**: Mobile friendly sidebar and layouts
- **Toast Notifications**: Success and error notifications
- **Search & Pagination**: Filter and paginate through products
- **Analytics Dashboard**: View product analytics

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth group routes
│   │   │   └── login/         # Login page
│   │   ├── dashboard/         # Protected dashboard routes
│   │   │   ├── products/      # Products page
│   │   │   ├── categories/    # Categories page
│   │   │   ├── analytics/     # Analytics page
│   │   │   └── layout.tsx     # Dashboard layout
│   │   ├── not-found.tsx      # 404 page
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── app-sidebar.tsx   # Dashboard sidebar
│   │   ├── header.tsx        # Dashboard header
│   │   ├── product-form.tsx  # Product form
│   │   └── ...
│   ├── lib/                   # Utilities and configurations
│   │   ├── api/              # RTK Query API definitions
│   │   ├── firebase/         # Firebase config and hooks
│   │   └── utils.ts          # Helper functions
│   ├── types/                # TypeScript type definitions
│   ├── middleware.ts         # Next.js middleware (route protection)
│   └── store.ts              # Redux store configuration
├── public/                    # Static assets
├── .env.local                # Environment variables
└── package.json

```

## Getting Started

### Important

- Node.js 18+
- npm or yarn
- Backend API running on port 4000

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Default Login Credentials

```
Username: demo
Password: demo123
```

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Key Features Explained

### Authentication & Protected Routes

The app uses Next.js middleware to protect dashboard routes:

```typescript

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (isDashboard && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
```

### Real-time Data with Firebase

Products sync in real-time using Firebase Firestore:

```typescript

export function useProductsRealtime() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(productQuery, (snapshot) => {
      // Real-time updates
    });
    return () => unsubscribe();
  }, []);
}
```

### API Integration with RTK Query

Backend API calls are handled via Redux Toolkit Query:

```typescript
// src/lib/api/products-api.ts
export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addProduct: builder.mutation<Product, FormData>({
      query: (formData) => ({
        url: "/api/products/add",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});
```

### Form Validation

Forms use React Hook Form with Zod schemas for validation

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | Yes |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Yes |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | Yes |


## Routing Structure

```
/ (redirects to /login or /dashboard)
├── /login                 # Login page (public)
├── /dashboard             # Protected routes
│   ├── /                  # Dashboard home
│   ├── /products          # Products management
│   ├── /categories        # Categories management
│   └── /analytics         # Analytics page
└── * (any invalid route)  # 404 Not Found page
```

## State Management

The app uses Redux Toolkit for:
- API caching (RTK Query)
- Loading states
- Error handling
- Optimistic updates

Real time data uses Firebase Firestore directly via custom hooks.

## Image Upload

Images are uploaded to the backend with these constraints:
- Maximum 5 images per product
- Max file size: 10MB per image
- Allowed formats: JPG, PNG
- Images are stored in `/uploads` directory on the backend

## Toast Notifications

Success and error messages are shown using Sonner:

```typescript
import { toast } from "sonner";

// Success
toast.success("Product added successfully!");

// Error
toast.error("Failed to save product. Please try again.");
```

## Building for Production

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Troubleshooting

### Common Issues

1. **Firebase connection errors**
   - Check Firebase credentials in `.env.local`
   - Verify Firebase project is active

2. **API connection errors**
   - Ensure backend is running on port 4000
   - Check `NEXT_PUBLIC_API_URL` in `.env.local`

3. **Authentication issues**
   - Clear browser cookies
   - Check if token cookie is being set

4. **Image upload fails**
   - Check file size (max 10MB)
   - Verify file format (JPG/PNG only)
   - Ensure backend `/uploads` directory exists

