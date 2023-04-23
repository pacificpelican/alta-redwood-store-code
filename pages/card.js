import React, { Component, useState, useEffect } from 'react';
import Link from "next/link";

import { store, view } from 'react-easy-state';

import cartstore from "../components/cartstore";

import ReactMarkdown from "react-markdown";

function addItemToCart(productID, quantity, productName) {
  const addedToCartTime = Date.now();
  console.log("running addItemToCart");
  console.log(productID);
  console.log(quantity);
  console.log(productName);
  let newCartObject = Object.assign({}, { productID: productID, quantity: quantity, productName: productName, addedToCartDateTime: addedToCartTime });
  console.log("[Card] about to add: ");
  console.log(newCartObject);
  cartstore.upsertItemToCart(newCartObject);
}

class Card extends Component {

  addTheItem = () => {
    console.log(this.props.spreadsheetdata);
    addItemToCart(this.props.spreadsheetdata.productID, 1, this.props.spreadsheetdata.productTitle);
  }

  render(props) {

    if ((typeof this.props.spreadsheetdata !== 'undefined') && (this.props.spreadsheetdata.productImage)) {
      let prodImg = this.props.spreadsheetdata.productImage;
      console.log("product image: " + prodImg);
      return (
        <div id="cardContainer">
          <h2 className="prodTitle">
            {/* <Link
              href={{
                pathname: "/product",
                query: {
                  product: this.props.spreadsheetdata.productID
                }
              }}
            > */}
              <a>{this.props.spreadsheetdata.productTitle}</a>
            {/* </Link>{" "} */}
          </h2>
          <section className="price">${this.props.spreadsheetdata.price}</section>
          <section className="description">
            <ReactMarkdown source={this.props.spreadsheetdata.description} />
          </section>
          <button className="addToCart" onClick={this.addTheItem}>add to cart</button>
          <section id="pImg"><img className="prodImg" alt={this.props.spreadsheetdata.description} src={prodImg} /></section>
          <style>
            {`
          div#cardContainer {
            background: Snow;
            font-family: "Ubuntu Mono", "Hack", "Fira Code", Menlo, monospace;
            outline-style: outset;
            padding-left: calc(0.3vw + 2pt);
          }
          @media (max-width: 800px) {
            button.addToCart {
              width: calc(55pt + 11vw);
              height: calc(20pt + 3vh);
              margin-top: calc(1vh + 1vw);
              margin-bottom: calc(1vh + 1vw);
            }
            img.prodImg {
              width: calc(8pt + 40vw);
            }
          }
          @media (min-width: 801px) {
            button.addToCart {
              width: calc(55pt + 8.5vw);
              height: calc(20pt + 3vh);
              margin-top: calc(1vh + 1vw);
              margin-bottom: calc(1vh + 1vw);
            }
            img.prodImg {
              width: calc(8pt + 10vw);
            }
          }
          section.price, section.description {
            margin-top: calc(0.5vh + 0.5vw);
            margin-bottom: calc(1vh + 1vw);
          }
          h2.prodTitle {
            margin-top: calc(1vw);
          }
        `}
          </style>
        </div>
      )
    }
    else if ((typeof this.props.spreadsheetdata !== 'undefined') && (this.props.spreadsheetdata.productTitle)) {
      return (
        <div id="cardContainer">
          <h2 className="prodTitle" key={this.props.spreadsheetdata.locator}>
              <a>{this.props.spreadsheetdata.productTitle}</a>
          </h2>
          <section className="price">${this.props.spreadsheetdata.price}</section>
          <section className="description">
            <ReactMarkdown source={this.props.spreadsheetdata.description} />
          </section>
          <button className="addToCart" onClick={this.addTheItem}>add to cart</button>
          <style>
            {`
          div#cardContainer {
            background: Snow;
            font-family: "Ubuntu Mono", "Hack", "Fira Code", Menlo, monospace;
            outline-style: outset;
            padding-left: calc(0.3vw + 2pt);
          }
          div#cardContainer img {
            height: auto;
            max-width: 100%;
          }
          @media (max-width: 800px) {
            button.addToCart {
              width: calc(55pt + 11vw);
              height: calc(20pt + 3vh);
              margin-top: calc(1vh + 1vw);
              margin-bottom: calc(1vh + 1vw);
            }
            img.prodImg {
              width: calc(8pt + 40vw);
            }
          }
          @media (min-width: 801px) {
            button.addToCart {
              width: calc(55pt + 11vw);
              height: calc(20pt + 3vh);
              margin-top: calc(1vh + 1vw);
              margin-bottom: calc(1vh + 1vw);
            }
            img.prodImg {
              width: calc(8pt + 10vw);
            }
          }
          section.price, section.description {
            margin-top: calc(0.5vh + 0.5vw);
            margin-bottom: calc(1vh + 1vw);
            margin-right: calc(2pt + 0.5vw);
          }
          h2.prodTitle {
            margin-top: calc(1vw);
          }
          h2.prodTitle a {
            color: inherit;
          }
        `}
          </style>
        </div>
      )
    }
    else {
      return null;
    }
  }
}
Card.getInitialProps = async ({ req }) => {
  return (
    {}
  )
}
export default view(Card);
