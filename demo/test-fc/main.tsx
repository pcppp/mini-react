import React from 'react';
import ReactDOM from 'react-dom/client';
const App = () => (
  <div>
    <Child />
  </div>
);
const Child = () => {
  return <span>123</span>;
};
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
