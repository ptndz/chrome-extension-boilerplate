import { createRoot } from 'react-dom/client';

import '../../globals.css';
import Popup from './Popup';
import './index.css';

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);

  root.render(<Popup />);
}

init();
