import React, { useState, useEffect } from 'react';

import { store, view } from 'react-easy-state';

import cartstore from "../components/cartstore";

import CartCard from "./cartCard";
import Link from "next/link";

function Cart() {
  return (
    <div id="cartContainer">
      <aside id="cart-info">
        <h5>Your <Link
          href={{
            pathname: "/cartpage"
          }}
        >
          <a>cart 🛒</a>
        </Link></h5>
        <section className="cartCardHeader">
          <span className="productName">product</span>{" "}
          <span className="productQ">quantity</span>
        </section>
        {cartstore.cart.map((item) => {
          console.log("cart item")
          console.log(item);
          return (
            <CartCard carddata={item} />
          )
        })}
      </aside>
      <style>
        {`
          html {
            box-sizing: border-box;
          }
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
          /* No left or right margin or padding on body or conatiner div to create end-to-end effect of images on screen */
          body {
            margin-left: 0px;
            margin-right: 0px;
            padding-left: 0px;
            padding-right: 0px;
          }
          section.productChoices {
            width: calc(96vw);
            margin-left: calc(0.9vw);
          }
          div#frontPageContainer {
          
            margin-left: calc(1vw + 5pt);
          }
          section.productChoices {
            display: grid;
            grid-gap: 10px;
            grid-template-columns: 1fr 1fr 1fr;
            background-color: #fff;
            color: #444;
          }
          #cartContainer h5, aside#cart-info {
            font-family: var(--uiFonts, monospace);
          }
          #cartContainer a {
            color: inherit;
          }
          span.productName, span.productQ {
            display: inline-block;
            width: calc(80pt + 10vw);
          }
          #cartContainer h5 {
            font-size: calc(1.1rem);
            margin-bottom: 8pt;
          }
        `}
      </style>
    </div>
  )
}

export default view(Cart);
