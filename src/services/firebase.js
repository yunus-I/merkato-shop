import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const perf = getPerformance(app);

// Collections
export const ORDERS_COLLECTION = 'orders';
export const PRODUCTS_COLLECTION = 'products';

// Order service
export const orderService = {
  async createOrder(orderData) {
    try {
      const orderWithMetadata = {
        ...orderData,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      
      const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderWithMetadata);
      
      // Log event
      logEvent(analytics, 'purchase', {
        value: orderData.total,
        currency: 'ETB',
        transaction_id: docRef.id
      });
      
      return { id: docRef.id, ...orderWithMetadata };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
};

// Product service
export const productService = {
  async getFeaturedProducts() {
    // For now, return mock data. You'll replace with real Firestore queries
    return [
      {
        id: 1,
        name: "Men's Cotton Socks",
        description: "Premium cotton socks, pack of 12 pairs",
        price: 1200,
        originalPrice: 1500,
        discount: 20,
        category: "socks",
        image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&h=400&fit=crop",
        minOrder: 12,
        inStock: true,
        rating: 4.5,
        reviews: 128
      },
      {
        id: 2,
        name: "Women's Underwear Set",
        description: "Comfortable cotton underwear, 12 pieces",
        price: 1800,
        originalPrice: 2200,
        discount: 18,
        category: "underwear",
        image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop",
        minOrder: 12,
        inStock: true,
        rating: 4.7,
        reviews: 95
      }
    ];
  }
};

export { db, analytics, perf };