import React from 'react';

const CreateMarketFormErrors = p => (
  <ul className={`create-market-form-errors ${p.className || ''}`} >
    {(p.errors || []).map(error => (
      <li
        key={error}
      >
        {error}
      </li>
    ))}
  </ul>
);

export default CreateMarketFormErrors;
