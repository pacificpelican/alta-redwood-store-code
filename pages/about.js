import React, { useState, useEffect } from 'react';
import Menu from "./menu";
import Footer from "./footer";

import { store, view } from 'react-easy-state';

import cartstore from "../components/cartstore";

import Link from "next/link";

import findProductNameFromID from "../components/findProductNameFromID";

import Head from 'next/head';

import Hummingbird from "../img/hummingbird";

function Aboutpage() {
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
        <h2 id="yourCart">About the <a href="https://altaredwood.com" id="ar">AltaRedwood.com</a> Store</h2>
        <h3 id="work">from <a href="https://altaredwood.work">altaredwood.work</a></h3>
        <div id="cartView">
          <p id="created">
            I created the Alta Redwood online store as a place to offer cool items based on my photography.  As a resident of the Pacific Northwest, I hear from people all over the world about how special they find this region, and I totally agree.  This store is my way of offering pins, prints and other products that I like and I hope you will like too!
          </p>
          <p>For now I can ship to U.S. addresses and am working on expanding my shipping area soon!</p>
          <aside id="avatar">
            <img src="./img/DM-BeaverLodge-2020.webp" id="dm-beaver-lodge" />
          </aside>
          <p id="caption">
            store creator <a href="https://danmckeown.info">Dan McKeown</a> <span id="photo">(photo: Jess McKeown, Dec. 2020)</span>
          </p>
          <h4>e-commerce platform powered by <a href="https://pacificio.com">pacificIO technology</a></h4>
          <h4>secure checkout powered by the <a href="https://stripe.com">Stripe</a> API</h4>
        </div>
      </aside>
     
      {/* <Hummingbird /> */}
      <Footer />
      <Head>
        <title>
          Alta Redwood Store - about page
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
          p#created, p#caption {
            width: calc(45vw + 10pt);
            font-family: var(--uiFonts, sans-serif);
          }
          img#dm-beaver-lodge {
            width: calc(45vw + 10pt);
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
          a#ar {
            text-decoration: none;
            color: inherit;
          }
          #cartView a, h3#work a {
            color: inherit;
          }
          h2 {
            font-family: var(--serifFonts, Helvetica);
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

export default view(Aboutpage);
