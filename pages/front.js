import React, { useState, useEffect } from 'react';
import Menu from "./menu";
import Footer from "./footer";

//  import Loader from "react-loader-spinner";

import { FidgetSpinner } from "react-loader-spinner"

import Card from "./card";

import { store, view } from 'react-easy-state';

import Cart from "./cart";
import cartstore from "../components/cartstore";

import Head from 'next/head';

function math_floor_random_number(scale) {
  var newdigit = Math.floor((Math.random() * scale) + 1);
  return newdigit;
}

function Front() {
  const [items, setItems] = useState([]);
  function getDataFromAPI_inventory() {
    let dest = "/api/1/getstore"
    const that = this;

    console.log("fetch GET request: " + dest);
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
        setItems(myReturn);
      });
  }
  useEffect(() => {
    getDataFromAPI_inventory();
  }, [])
  useEffect(() => {
    setInterval(() => {
      cartstore.saveCartToLocalStorage();
    }, 5500)
  }, [])
  if (items.length > 0) return (
    <div id="frontPageContainer">
      <Menu />
      <div id="main">
        <section className="productChoices">
          {items.reverse().map(function (inVal) {
            console.log("inVal");
            console.log(inVal);
            if ((inVal.hidden) && ((inVal.hidden.toString() === `yes`) || (inVal.hidden === `true`))) {
              console.log(inVal.productID);
            }
            else {
              if (Number(inVal.totalInventory) > 0) {
                return <Card spreadsheetdata={inVal} key={inVal + math_floor_random_number(333)} />
              }
              else {
                return null;
              }
            }
          })}
        </section>
        <aside id="cart">
          <Cart />
        </aside>
      </div>
      <Footer />
      <Head>
        <title>
          {process.env.NEXT_PUBLIC_WEBSITE_NAME} Store
        </title>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
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
            width: calc(92vw);
            margin-left: calc(0.9vw);
          }
          div#frontPageContainer {
            margin-left: calc(1vw + 5pt);
          }
          section.productChoices {
            color: #444;
          }
          @media (max-width: 800px) {
            section.productChoices {
              display: inline-block;
            }
            div#frontPageContainer {
              margin-right: calc(1vw + 10pt);
            }
          }
          @media (min-width: 801px) {
            section.productChoices {
              display: grid;
              grid-gap: 10px;
              grid-template-columns: 1fr 1fr 1fr;
              background-color: #fff;
            }
            div#main {
              display: flex;
            }
            aside#cart {
              margin-left: calc(3vw + 10pt);
              width: calc(35vw + 350px);
            }
     
          }
        `}
      </style>
    </div>
  )
  if (items.length === 0) return (<>
    <Menu />
    <div id="loading">
      <main id="no-items">
        <FidgetSpinner />
      </main>
    </div>
    <Footer />
  </>)
}

export default view(Front);
