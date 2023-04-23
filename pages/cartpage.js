import React, { useState, useEffect } from 'react';
import Menu from "./menu";
import Footer from "./footer";

import { store, view } from 'react-easy-state';

import cartstore from "../components/cartstore";

import Link from "next/link";

import findProductNameFromID from "../components/findProductNameFromID";

import Head from 'next/head';

import Hummingbird from "../img/hummingbird";

function Cartpage() {
  const deleteProductFromCart = function (productID) {
    console.log("about to delete product id #" + productID + " from cart");
    cartstore.deleteProductFromCart(productID);
  }
  const [item, setItem] = useState([]);

  useEffect(() => {
    let dest = "/api/1/getstore";
    console.log(dest);

    fetch(dest, { method: "get" })
      .then(function (response) {
        if (response.ok) {
          console.log("response ok");

          return response.json();
        } else {
          throw new Error(response.Error);
        }
      })
      .then(function (myReturn) {
        console.log(myReturn);
        setItem(myReturn);
      });
  }, [])

  return (
    <div id="cartContainer">
      <Menu />
      <aside id="cart-info">
        <h5 id="yourCart">view and edit your cart 🛒</h5>
        <div id="cartView">
          <ul id="cartList">
            <lh className="cartItem"><span className="productID">product</span>  <span className="quantity">quantity</span>  <span className="delete">delete</span></lh>
            {cartstore.getCart().map(function (iVal) {
              return <li key={iVal.productID} className="cartItem"><span className="productID">{findProductNameFromID(iVal.productID, item)}</span>  <span className="quantity">{iVal.quantity}</span>  <span onClick={deleteProductFromCart.bind(null, iVal.productID)} className="delete"><a href="#">✖️</a></span></li>  // deleteProductFromCart(iVal.productID)
            })}
          </ul>
        </div>
      </aside>
      <section className="checkoutLink">
        <Link
          href={{
            pathname: "/checkout"
          }}>
          <span id="goToCheckout"><Link
          href={{
            pathname: "/checkout"
          }}>Check Out</Link></span></Link>
      </section>
      <Hummingbird />
      <Footer />
      <Head>
        <title>
          Alta Redwood Store - cart page
        </title>
      </Head>
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
          div#cartContainer {
            margin-left: calc(0.9vw);
          }
          ul#cartList {
            list-style-type: none;
            display: inline-block;
            font-family: var(--uiFonts, sans-serif);
          }
          
          ul#cartList li span, ul#cartList lh span { 
            display: block;
            float: left;
            width: calc(10pt + 15vw);
            height: calc(10pt + 5vh);
            border-style: solid;
            padding-top: calc(5pt + 1vw);
            padding-left: calc(5pt + 2vw);
            margin-top: calc(5pt + 1vw);
            padding-left: calc(5pt + 2vw)
          }
          #checkoutLink {
            display: inline-block;
          }
          #goToCheckout {
            display: block;
            background: #edf2f5;
            width: calc(10pt + 40vw);
            height: calc(10pt + 12vh);
            font-family: var(--displayFonts, serif);
            font-size: calc(2rem);
            padding-top: calc(5pt + 1vw);
            padding-left: calc(5pt + 2vw);
            border-radius: calc(3px);
          }
          #goToCheckout a {
            color: inherit;
          }
          h5#yourCart {
            font-family: var(--monoFonts, serif);
            margin-bottom: calc(0.2vh);
          }
        `}
      </style>
    </div>
  )
}

export default view(Cartpage);
