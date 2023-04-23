import React, { Component } from 'react';

import Okviewer from "./adminProducts";
import Inventory from "./adminInventory";

import Menu from "./menu";
import Userinfo from "./userinfo";

import CreateProduct from "./adminCreateProduct";

import Orders from "./adminOrders";

export default class Admin extends Component {
  defaultFormState = {
    title: '',
    price: '',
    supplier: '',
    description: ''
  }
  state = {items: []}
  getDataFromAPI_items() {
    let dest = "/api/1/getstoreitems/limit/50"
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
        that.setState({items: myReturn});
      });
  }
  componentDidMount() {
    this.getDataFromAPI_items();
  }
  render() {
    return (
      <div id="parrotsAdmin">
        <Menu />
        <Userinfo />
        <section id="createProduct">
          <br />
          <details>
            <summary><span id="bigPlus">+</span></summary>
            <CreateProduct />
          </details>
        </section>
        <section id="itemsList">
          <Okviewer store="default" table="store_items" />
        </section>
        <section id="inventory">
          <Inventory spreadsheetdata={this.state.items} store="default" table="store_items" />
        </section>
        <Orders />
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
          div#items {
            font-family: var(--courierFonts, monospace);
            background: LightCyan;
          }
          form#itemForms input, button#items {
            width: calc(12pt + 8vw);
            height: calc(6pt + 3vh);
            font-size: calc(1.25rem);
          }
          div#registerParrots {
            margin-left: calc(1vw + 5pt);
          }
          div#parrotsAdmin {
            margin-left: calc(0.9vw);
          }
          div#parrotsAdmin h2, div#parrotsAdmin h3, div#parrotsAdmin h4, div#parrotsAdmin h5, div#parrotsAdmin h6 {
            font-family: var(--serifFonts, monospace);
          }
          #bigPlus {
            font-size: calc(2.5rem);
          }
		    `}
        </style>
      </div>
    )
  }
}
