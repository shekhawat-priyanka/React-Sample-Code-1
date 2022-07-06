import React, { Fragment } from 'react';
import spinner from '../assets/spinner.gif';

export default () => (
  <Fragment>
    <img
      src={spinner}
      alt='Loading...'
      style={{ width: '200px', margin: 'auto', display: 'block' }}
    />
  </Fragment>
);
