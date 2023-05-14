import reloadonce from "../components/reloadOnce";

import { store, view } from 'react-easy-state';

import Link from "next/link";

function menu() {
  return (
    <div id="parrotsMenuContainer">
      <h1>{process.env.NEXT_PUBLIC_WEBSITE_NAME}</h1>
      <ul id="frontChoices">
        <li key="home"><Link
          href={{
            pathname: "/"
          }}
        >Home</Link></li>
        <li key="about"><Link
          href={{
            pathname: "/about"
          }}>
          About</Link>
        </li>
        <li key="profile"><Link
          href={{
            pathname: "/profile"
          }}>
          Profile</Link>
        </li>
        <li key="cart"><Link
          href={{
            pathname: "/cartpage"
          }}>
          Cart</Link>
        </li>
        <li key="register"><a href="/register">Register</a></li>
        <li key="login"><Link
          href={{
            pathname: "/login"
          }}>
          Log In</Link>
        </li>
        <li key="logout"><Link
          href={{
            pathname: "/logout"
          }}>
          Log Out</Link></li>
        <li key="reload"><a href="#" onClick={reloadonce}>Reload</a></li>
      </ul>
      <style>
        {`
          :root {
            --uiFonts: "Ubuntu Mono", "Inconsolata", "Anonymous Pro", "Hack", Menlo,
              monospace;
            --serifFonts: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
            --contentFonts: "Lato", "Open Sans", "Lucida Grande", "Ubuntu Sans",
              "Segoe UI", "Roboto", Helvetica, sans-serif;
            --displayFonts: "Gentona", "Baufra", Helvetica, sans-serif;
            --monoFonts: "Anonymous Pro", "Hack", "Fira Sans", "Inconsolata",
              monospace;
            --textFonts: "Calluna", "Caslon", "Garamond" serif;
            --courierFonts: 'Courier New', Courier, monospace;
          }
          html {
            box-sizing: border-box;
          }
          /* No left or right margin or padding on body or conatiner div to create end-to-end effect of images on screen */
          body {
            margin-left: 4pt;
            margin-right: 0px;
            padding-left: 0px;
            padding-right: 0px;
          }
          div#parrotsMenuContainer {
            font-family: var(--monoFonts, monospace);
            background: WhiteSmoke;
          }
          ul#frontChoices {
            list-style: none;
          }
          @media (min-width: 800px) {
            ul#frontChoices {
              display: flex;
            }
          }
          ul#frontChoices li {
            margin-right: calc(4pt + 1vw);
          }
          ul#frontChoices a {
            color: inherit;
          }
        `}
      </style>
    </div>
  );
}


export default view(menu);
