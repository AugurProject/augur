import React from 'react';

const CreateMarketReview = p => (
  <article className={`create-market-form-part create-market-form-review ${p.className || ''}`}>
    <div className="create-market-form-part-content">
      <div className="create-market-form-part-input">
        <aside>
          <h3>Creation Cost Overview</h3>
          <span>These are the costs related to the creation of this market.</span>
        </aside>
        <div className="vertical-form-divider" />
        <form onSubmit={e => e.preventDefault()} >
          <span>TODO</span>
        </form>
      </div>
    </div>
  </article>
);

export default CreateMarketReview;
