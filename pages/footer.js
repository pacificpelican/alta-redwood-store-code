import Userinfo from "./userinfo";

import { store, view } from 'react-easy-state';

function footer() {
  return (
    <div id="parrotsFooterContainer">
      <ul id="footerChoices">
        <li><Userinfo /></li>
        <li id="terms"><a href="/terms">Terms</a></li>
        <li id="privacy"><a href="/privacy">Privacy</a></li>
      </ul>
      <style>{`
        ul#footerChoices {
          list-style: square outside none;
          font-family: 'Courier New', 'Courier', 'Roboto', 'Ubuntu', 'San Francisco', 'Segoe UI', serif;
        }
        ul#footerChoices a {
          color: inherit;
        }
      `}</style>
    </div>
  );
}

export default view(footer);
