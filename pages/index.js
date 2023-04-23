import Front from "./front";

import { store, view } from 'react-easy-state';

function home() {
return(
  <React.Fragment>
    <Front />
  </React.Fragment>
);
}

export default view(home);
