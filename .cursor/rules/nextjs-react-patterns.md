# Next.js & React Development Patterns

## 🚀 **NEXT.JS APP ROUTER PATTERNS**

### 1. **File Structure Standards**
```
src/
├── app/
│   ├── (auth)/          # Route groups for layout sharing
│   ├── api/             # API routes
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # Reusable components
├── lib/                 # Utility functions
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

### 2. **Component Architecture**
- **Server Components by default** - use `'use client'` only when needed
- **Co-locate related files** (component + styles + tests)
- **Barrel exports** for clean imports
- **Composition over inheritance** for component reuse

### 3. **API Route Patterns**
```typescript
// Standard API route structure
export async function GET(request: NextRequest) {
  try {
    // Implementation
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error message' },
      { status: 500 }
    );
  }
}
```

## ⚛️ **REACT HOOKS BEST PRACTICES**

### 4. **State Management Patterns**
```typescript
// Prefer multiple useState over single complex state
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<Data[]>([]);

// Use useCallback for functions passed to children
const handleSubmit = useCallback(async (formData: FormData) => {
  // Implementation
}, [dependency]);

// Use useMemo for expensive calculations
const filteredData = useMemo(() => 
  data.filter(item => item.active), [data]
);
```

### 5. **Effect Management**
```typescript
// Separate effects by concern
useEffect(() => {
  fetchData();
}, []); // Initial data fetch

useEffect(() => {
  applyFilters();
}, [filters, data]); // Filter application

// Cleanup in effects
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, []);
```

### 6. **Custom Hooks for Logic Reuse**
```typescript
// Extract complex logic into custom hooks
function useApiData<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return { data, loading, error, refetch: fetchData };
}
```

## 🎨 **STYLING ARCHITECTURE**

### 7. **CSS-in-JS vs CSS Modules vs Global CSS**
- **Global CSS** for design system variables and utilities
- **CSS Modules** for component-specific styles
- **Inline styles** for dynamic/conditional styling
- **CSS-in-JS** only when absolutely necessary

### 8. **Design System Implementation**
```css
/* globals.css - Design system foundation */
:root {
  /* Color palette */
  --primary-color: #007ea7;
  --secondary-color: #003459;
  
  /* Typography scale */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  
  /* Spacing scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
}

/* Utility classes */
.btn-primary {
  background: var(--primary-color);
  /* ... */
}
```

### 9. **Responsive Design Patterns**
```css
/* Mobile-first responsive design */
.container {
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* CSS Grid for complex layouts */
.grid-responsive {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
```

## 🔧 **FORM HANDLING PATTERNS**

### 10. **Controlled Components**
```typescript
function FormComponent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation and submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
    </form>
  );
}
```

### 11. **Form Validation Patterns**
```typescript
// Client-side validation
const validateForm = (data: FormData): string[] => {
  const errors: string[] = [];
  
  if (!data.email.includes('@')) {
    errors.push('Invalid email format');
  }
  
  return errors;
};

// Real-time validation
const [errors, setErrors] = useState<string[]>([]);

useEffect(() => {
  const validationErrors = validateForm(formData);
  setErrors(validationErrors);
}, [formData]);
```

## 📡 **DATA FETCHING PATTERNS**

### 12. **Client-Side Data Fetching**
```typescript
// Custom hook for API calls
function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
```

### 13. **Optimistic Updates**
```typescript
const handleUpdate = async (id: string, newData: Partial<Item>) => {
  // Optimistic update
  setItems(prev => prev.map(item => 
    item.id === id ? { ...item, ...newData } : item
  ));

  try {
    await updateItem(id, newData);
  } catch (error) {
    // Revert on error
    setItems(prev => prev.map(item => 
      item.id === id ? originalItem : item
    ));
    setError('Update failed');
  }
};
```

## 🎭 **COMPONENT PATTERNS**

### 14. **Compound Components**
```typescript
// Modal compound component
const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

Modal.Header = ({ children }) => (
  <div className="modal-header">{children}</div>
);

Modal.Body = ({ children }) => (
  <div className="modal-body">{children}</div>
);

Modal.Footer = ({ children }) => (
  <div className="modal-footer">{children}</div>
);
```

### 15. **Render Props Pattern**
```typescript
// Data provider with render props
function DataProvider<T>({ 
  url, 
  children 
}: { 
  url: string; 
  children: (data: T | null, loading: boolean, error: string | null) => React.ReactNode;
}) {
  const { data, loading, error } = useApi<T>(url);
  return <>{children(data, loading, error)}</>;
}

// Usage
<DataProvider<User[]> url="/api/users">
  {(users, loading, error) => (
    loading ? <Spinner /> : 
    error ? <Error message={error} /> :
    <UserList users={users} />
  )}
</DataProvider>
```

### 16. **Higher-Order Components (HOCs)**
```typescript
// Authentication HOC
function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { data: session, status } = useSession();
    
    if (status === 'loading') return <Loading />;
    if (!session) return <LoginPrompt />;
    
    return <Component {...props} />;
  };
}

// Usage
const ProtectedPage = withAuth(DashboardPage);
```

## 🔄 **STATE MANAGEMENT PATTERNS**

### 17. **Context for Global State**
```typescript
// Theme context
const ThemeContext = createContext<{
  theme: 'light' | 'dark';
  toggleTheme: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

### 18. **Reducer Pattern for Complex State**
```typescript
// Complex state with useReducer
type State = {
  items: Item[];
  loading: boolean;
  error: string | null;
  filters: FilterState;
};

type Action = 
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Item[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'UPDATE_FILTERS'; payload: Partial<FilterState> };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, items: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    default:
      return state;
  }
}
```

## 🎯 **PERFORMANCE OPTIMIZATION**

### 19. **Memoization Strategies**
```typescript
// Memoize expensive calculations
const ExpensiveComponent = memo(({ data, filters }) => {
  const processedData = useMemo(() => 
    data.filter(item => matchesFilters(item, filters))
      .sort((a, b) => a.priority - b.priority),
    [data, filters]
  );

  return <DataVisualization data={processedData} />;
});

// Memoize callback functions
const ParentComponent = () => {
  const [items, setItems] = useState([]);
  
  const handleItemUpdate = useCallback((id: string, updates: Partial<Item>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  return (
    <ItemList 
      items={items} 
      onItemUpdate={handleItemUpdate} 
    />
  );
};
```

### 20. **Code Splitting & Lazy Loading**
```typescript
// Lazy load components
const AdminPanel = lazy(() => import('./AdminPanel'));
const UserDashboard = lazy(() => import('./UserDashboard'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </Suspense>
  );
}

// Dynamic imports for utilities
const heavyUtility = await import('./heavyUtility');
const result = heavyUtility.processData(data);
```

## 🔒 **SECURITY PATTERNS**

### 21. **Input Sanitization**
```typescript
// Sanitize user input
import DOMPurify from 'dompurify';

const SafeHTML = ({ content }: { content: string }) => {
  const sanitizedContent = useMemo(() => 
    DOMPurify.sanitize(content), [content]
  );
  
  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
};
```

### 22. **Environment Variables**
```typescript
// Type-safe environment variables
const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
  dbUrl: process.env.DATABASE_URL!, // Server-side only
} as const;

// Validation
if (!config.apiUrl) {
  throw new Error('NEXT_PUBLIC_API_URL is required');
}
```

---

## 📋 **COMPONENT CHECKLIST**

For every new component:

- [ ] TypeScript interfaces defined
- [ ] Props properly typed
- [ ] Error boundaries implemented
- [ ] Loading states handled
- [ ] Accessibility attributes added
- [ ] Responsive design tested
- [ ] Performance optimized (memo/useMemo if needed)
- [ ] Unit tests written

---

**These patterns ensure scalable, maintainable, and performant React/Next.js applications. Adapt specific implementations based on project requirements while maintaining these architectural principles.**
