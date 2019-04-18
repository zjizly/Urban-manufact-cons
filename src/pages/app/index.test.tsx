import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from '.';
import { BrowserRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render((
    <BrowserRouter>
      <App />
    </BrowserRouter>
  ), div);
  ReactDOM.unmountComponentAtNode(div);
});
