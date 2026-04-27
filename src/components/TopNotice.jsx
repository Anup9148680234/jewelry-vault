import React from 'react';

function TopNotice({ children, tone }) {
  return <div className={`top-notice ${tone}`}>{children}</div>;
}

export default TopNotice;
