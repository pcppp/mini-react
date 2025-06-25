import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState } from 'react';
const App = () => {
  const [num, setNum] = useState(0);
  return num === 3 ? (
    <Child />
  ) : (
    <div onClick={() => setNum(num + 1)}>{num}</div>
  );
};
const Child = () => {
  return <span>123</span>;
};
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
