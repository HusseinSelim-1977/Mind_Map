import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    console.error('ErrorBoundary caught error:', error)
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: '20px', color: 'red'}}>
          <h1>Something went wrong</h1>
          <pre>{this.state.error?.message}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

async function enableMocking() {
  // Disabled - using real backend
  return
  // if (import.meta.env.MODE !== 'development') {
  //   return
  // }

  // const { worker } = await import('./mocks/browser')
  // return worker.start({
  //   onUnhandledRequest: 'bypass',
  // })
}

enableMocking().then(() => {
  console.log('Main: Starting app render');
  const rootElement = document.getElementById('root');
  console.log('Main: Root element:', rootElement);
  ReactDOM.createRoot(rootElement!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </AuthProvider>
      </ErrorBoundary>
    </React.StrictMode>,
  )
  console.log('Main: App rendered');
})
