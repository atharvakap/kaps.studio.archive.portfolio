import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Update the QueryClient with global default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Trust the cache for 24 hours. Prevents redundant API calls on tab switches.
      staleTime: 1000 * 60 * 60 * 24,
      // Stop it from aggressively refetching when the user clicks away to another browser tab and comes back
      refetchOnWindowFocus: false,
      // Keep data in memory for 24 hours even if the component unmounts
      gcTime: 1000 * 60 * 60 * 24,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
)
