import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "stream-chat-react/dist/css/v2/index.css"
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { StreamChatProvider } from './context/StreamChatContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <StreamChatProvider>
            <App />
          </StreamChatProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)