import { render } from 'preact';
import { App } from './components/App/App';

import './style.css';

render(<App />, document.getElementById('app') as HTMLElement);
