import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// FIX: Corrected the global JSX type definition to properly augment React's intrinsic elements. The previous declaration was overwriting the built-in IntrinsicElements, causing errors for all standard HTML tags. Adding an index signature `[elemName: string]: any;` preserves the standard elements while adding support for 'ion-icon'.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        name: string;
        class?: string;
      };
      [elemName: string]: any;
    }
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
