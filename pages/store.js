import Front from "./front";

import { store, view } from 'react-easy-state';

//  This page should load the store, just like the `classic` indes page
function storefront() {
  return (
    <React.Fragment>
      <Front />
    </React.Fragment>
  );
}

export default view(storefront);
