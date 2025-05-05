import * as React from 'react';

export const ForgotPasswordEmail = ({ name, url }) => (
  <div>
    <h1>Welcome, {name}!</h1>
    <p>
      Reset password{' '}
      <a href={url} target="_blank">
        Click here
      </a>{' '}
      to reset.
    </p>
  </div>
);
