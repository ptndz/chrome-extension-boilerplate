import { createRoot } from 'react-dom/client';
import Content from './Content';
import './tailwind-input.css';
function init(){
  const app = document.createElement('div');
  app.id = 'ptn1411-extension-content-view-root';
  
  document.body.append(app);
  
  const container = document.getElementById(
    'ptn1411-extension-content-view-root'
  );
  if (!container) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(container);
  
  root.render(<Content />);
}
init()