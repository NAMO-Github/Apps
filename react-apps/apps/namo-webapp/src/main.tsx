import Error from '@components/Error';
import { AuthProvider } from '@context/auth';
import { PromptModalProvider } from '@context/prompt-modal';
import { environment } from '@namo-workspace/environments';
// import { StrictMode } from 'react';
// disable strict mode for fix call api twice
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import { WalletAuthProvider } from './context/wallet-auth';

Sentry.init({
  dsn: 'https://a4a00fe2ac96480288a381393da9c650@o1324755.ingest.sentry.io/6686286',
  integrations: [new BrowserTracing()],
  environment: environment.production ? 'production' : 'development',
  enabled: environment.production,
  debug: !environment.production,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  // <StrictMode>
  <BrowserRouter>
    <Sentry.ErrorBoundary fallback={<Error />}>
      <PromptModalProvider>
        <WalletAuthProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </WalletAuthProvider>
      </PromptModalProvider>
    </Sentry.ErrorBoundary>
  </BrowserRouter>
  // </StrictMode>
);
