import React, { useState, useEffect, Component } from 'react';
import Menu from "./menu";
import Footer from "./footer";

import { store, view } from 'react-easy-state';
import Head from 'next/head';

import cartstore from "../components/cartstore";

import Cart from "./cart";
import StripeForm from "../components/Stripeprovider";
import findProductNameFromID from "../components/findProductNameFromID";

import { motion } from "framer-motion";

import Userinfo from "./userinfo";

class Checkout extends Component {

  constructor(props) {
    super();
    this.state = {
      inventory: [], products: [], total: 0, bill: 0, inventoryStatus: false, shippingCost: Number(process.env.NEXT_PUBLIC_SHIPPING_RATE), salesTaxRate: Number(process.env.NEXT_PUBLIC_TAX_RATE), subtotal: 0, shipping: 0, quantity: 0, tax: 0, address1: '', address2: '', city: '', state: '', zip: '', shippingName: '', shippingPhone: '', coupon: '', inventoryMessage: 'pending'
    }
  }

  makePurchase() {
    console.log('attempting to charge card and complete purchase')
  }

  goBack() {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  }

  checkInventoryStatus(cartArray, inventoryArray) {
    // ensure that the qunatity of each item in the cartArray does not exceed the inventory total for corresponding products in inventoryArray; true or false
    let resBool = true;
    console.log("running checkInventoryStatus");
    console.log(cartArray);
    console.log(inventoryArray);
    cartArray.map(function (cv) {
      console.log(cv);
      console.log(cv.productID);
      for (let i = 0; i < inventoryArray.length; i++) {
        if (Number(cv.productID) === Number(inventoryArray[i].productID)) {
          console.log("product ID #" + cv.productID + " matched");
          console.log(Number(inventoryArray[i].totalInventory));
          console.log(Number(cv.quantity));

          let ic = Number(inventoryArray[i].totalInventory);
          console.log(ic);
          let cc = Number(cv.quantity);
          console.log(cc);
          if (ic >= cc) {
            console.log("available inventory can cover this request for product ID #" + inventoryArray[i].productID);
          }
          else {
            resBool = false;
          }
        }
      }
    })
    console.log("checkInventoryStatus is returning " + resBool);
    this.setState(
      { inventoryStatus: resBool })
    return resBool;
  }

  calculateTotalBill = (subtotal, shippingCost, quantity, taxRate) => {
    const ship = this.state.shipping;
    const tax = this.calculateTax(subtotal, taxRate);
    const total = subtotal + ship + tax;
    return total;
  }

  calculateSubtotal = (cartArray, inventoryArray) => {
    console.log("running calculateSubtotal");
    let subtotal = 0;
    let quantity = 0;
    cartArray.map((cv) => {
      inventoryArray.some((sv) => {
        if (Number(cv.productID) === Number(sv.productID)) {
          subtotal += Number(Number(sv.price) * Number(cv.quantity));
          quantity += Number(cv.quantity);
        }
      })
    })
    console.log("subtotal: " + subtotal);
    console.log("quantity: " + quantity);
    this.setState({ quantity: Number(quantity), subtotal: Number(subtotal) })
  }

  calculateShipping = (shippingCost, quantity) => {
    const theReturn = shippingCost * quantity;
    console.log("calculating shipping: " + theReturn
    )
    this.setState({ shipping: theReturn });
    return theReturn;
  }

  calculateTax = (subtotal, taxRate) => {
    console.log("calculateTax: " + subtotal + " " + taxRate);
    return subtotal * taxRate;
  }

  getDataFromAPI_inventory() {
    let dest = "/api/1/getstore"
    const that = this;

    console.log("fetch GET request: " + dest);
    fetch(dest, { method: "get" })
      .then((response) => {
        if (response.ok) {
          console.log("response ok");

          return response.json();
        } else {
          throw new Error(response.Error);
        }
      })
      .then((myReturn) => {
        console.log(myReturn);
        that.setState({ inventory: myReturn });
      });
  }

  getOrderObject = (cartData, formikData) => {
    console.log("running getOrderObject");
    let newObj = Object.assign({}, cartData);
    let newObjString = JSON.stringify(newObj);
    let newObjStringURL = encodeURIComponent(newObjString);
    return newObjStringURL;
  }

  getTransactionObject = (subtotal, tax, shipping, total) => {
    console.log("shipping parameter: " + shipping);
    let transObj = Object.assign({}, {
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      shipping: Number(this.state.shipping.toFixed(2)),
      total: Number(total.toFixed(2)),
      coupon: this.state.coupon
    });
    let transObjString = JSON.stringify(transObj);
    let transObjStringURL = encodeURIComponent(transObjString);
    console.log("getTransactionObject");
    console.log(transObjString);
    console.log("returning getTransactionObject");
    console.log(transObjStringURL);
    return transObjStringURL;
  }

  getShippingObject = (name, address1, address2, city, state, zip, phone) => {
    let shipObj = Object.assign({}, {
      name: name,
      address1: address1,
      address2: address2,
      city: city,
      state: state,
      zip: zip,
      phone: phone
    });
    let shipObjString = JSON.stringify(shipObj);
    let shipObjStringURL = encodeURIComponent(shipObjString);
    return shipObjStringURL;
  }

  handleSubmit = (form) => {  //  deprecated: the Formik form has its data harvested asynchronously to state and submitted as a param in the /charge API call
    console.log("form submitted");
    console.log(form);
  }

  handleChangeShippingName = (event) => {
    this.setState({ shippingName: event.target.value });
  }

  handleChangeShippingPhone = (event) => {
    this.setState({ shippingPhone: event.target.value });
  }

  handleChangeAddress1 = (event) => {
    this.setState({ address1: event.target.value });
  }

  handleChangeAddress2 = (event) => {
    this.setState({ address2: event.target.value });
  }

  handleChangeCity = (event) => {
    this.setState({ city: event.target.value });
  }

  handleChangeState = (event) => {
    this.setState({ state: event.target.value });
  }

  handleChangeZip = (event) => {
    this.setState({ zip: event.target.value });
  }

  handleChangeCoupon = (event) => {
    this.setState({ coupon: event.target.value });
  }

  componentDidMount(props) {
    console.log(this.props);
    this.getDataFromAPI_inventory();

    let inventoryStatus;
    let subtotal;
    let tax;
    setTimeout(() => {
      console.log(cartstore.cart);
      inventoryStatus = this.checkInventoryStatus(cartstore.cart, this.state.inventory);
      //  inventoryStatus state variable is updated inside the checkInventoryStatus method

      subtotal = this.calculateSubtotal(cartstore.cart, this.state.inventory);
      tax = this.calculateTax(this.state.subtotal, this.state.taxRate);

      setTimeout(() => {
        this.calculateShipping(Number(this.state.shippingCost), Number(this.state.quantity));
      }, 2000)

    }, 2000)
    console.log(inventoryStatus);
    console.log(subtotal);
  }

  render() {

    if ((this.state.inventoryStatus) && (this.calculateTotalBill(Number(this.state.subtotal), Number(this.state.shippingCost), Number(this.state.quantity), Number(this.state.salesTaxRate)) > 0)) {
      return (
        <div id="cartContainer">
          <Menu />
          <div className="wrapper">

            <aside id="cart-info" className="box c">
              <Cart />
            </aside>
            <aside id="cart-status-vs-inventory" className="d">
              <h4>Inventory</h4>
              <span>inventory available?:{" "}{this.state.inventoryStatus.toString()}</span>
            </aside>
            <div id="order" className="box b">
              <h4 className="detailsInfo">Your Order</h4>
              <h6 className="details">Shipping</h6>
              <span id="shippingInfo">
                Shipping is ${this.state.shippingCost} per item (US only)
              </span>
              <h6 id="tax">Tax</h6>
              <span id="taxInfo">
                We apply the {process.env.NEXT_PUBLIC_NEXUS} sales tax rate of {this.state.salesTaxRate * 100}% per item
              </span>
              <h6 id="bill">Your bill</h6>
              <p id="statement">
                <i>Your card statement should have a charge for the Total amount from "<b>{process.env.NEXT_PUBLIC_BILLING_NAME}</b>"</i>
              </p>
              <b id="subtotal">subtotal: ${Number(this.state.subtotal.toFixed(2))}</b>
              <br />
              <span id="shipping">Shipping: ${this.state.shipping}</span>
              <br />
              <span className="taxBill">Tax: ${this.calculateTax(Number(this.state.salesTaxRate), Number(this.state.subtotal)).toFixed(2)}</span>
              <br />
              <b className="total">Total: ${this.calculateTotalBill(Number(this.state.subtotal), Number(this.state.shippingCost), Number(this.state.quantity), Number(this.state.salesTaxRate)).toFixed(2)}</b>
              <h6 id="coupon">Coupon Code</h6>
              <input
                value={this.state.coupon}
                onChange={this.handleChangeCoupon}
                name="coupon"
                type="string"
                placeholder="coupon"
              />
              <br />
              <span id="couponInfo">{this.state.coupon}</span>
              <h6 id="items">Items</h6>
              <ul id="itemsList">
                {cartstore.cart.map((cv) => {
                  return <li>{findProductNameFromID(cv.productID, this.state.inventory)} {" ("}{cv.quantity}{") "}</li>
                })}
              </ul>
              <h6 id="shipping">Shipping Address</h6>
              <b className="shippingInfo">{this.state.shippingName}</b>{" "}<br /><b className="shippingInfo">{this.state.address1}</b>{" "}<b className="shippingInfo">{this.state.address2}</b>{" "}<br /><b className="shippingInfo">{this.state.city}</b>{" "}<b className="shippingInfo">{this.state.state}</b>{" "}<b>{this.state.zip}</b>{" "}
            </div>

            <div className="box a">
              <h4>Check out</h4>
              <section id="checkoutFormSection">
                <b id="shippingInfoFom">Enter Your Shipping Info</b>
                <br /><br />
                <span className="label">name:</span>  <input
                  value={this.state.shippingName}
                  onChange={this.handleChangeShippingName}
                  name="shippingName"
                  type="string"
                  placeholder="shipping name"
                  required
                />
                <br />
                <span className="label">phone:</span> <input
                  value={this.state.shippingPhone}
                  onChange={this.handleChangeShippingPhone}
                  name="shippingPhone"
                  type="string"
                  placeholder="shipping phone #"
                  required
                />
                <br />
                <span className="label2">address 1:</span> <input
                  value={this.state.address1}
                  onChange={this.handleChangeAddress1}
                  name="shippingaddressLine1"
                  type="string"
                  placeholder="shipping address Line 1"
                  required
                />
                <br />
                <span className="label2">address 2:</span><input
                  value={this.state.address2}
                  onChange={this.handleChangeAddress2}
                  name="shippingaddressLine2"
                  type="string"
                  placeholder="shipping address Line 2"
                />
                <br />
                <span className="label">city:</span> <input
                  value={this.state.city}
                  onChange={this.handleChangeCity}
                  name="shippingcity"
                  type="string"
                  placeholder="shipping city"
                  required
                />
                <br />
                <span className="label">state:</span> <input
                  value={this.state.state}
                  onChange={this.handleChangeState}
                  name="shippingstate"
                  type="string"
                  placeholder="shipping state"
                  required
                />
                <br />
                <span className="label">ZIP:</span> <input
                  value={this.state.zip}
                  onChange={this.handleChangeZip}
                  name="shippingzip"
                  type="string"
                  placeholder="shipping zip"
                  required
                />
              </section>
              <p id="terms">Making a purchase signals agreement to our <a href="/terms" target="_blank">terms</a> and <a href="/privacy" target="_blank">privacy policy</a>.</p>
              <p id="note">Using an account is optional but helps you track your order: <Userinfo /></p>
              <div id="autoForm">
                <StripeForm order={this.getOrderObject(cartstore.cart, {})} shipping={this.getShippingObject(this.state.shippingName, this.state.address1, this.state.address2, this.state.city, this.state.state, this.state.zip, this.state.shippingPhone)} transaction={this.getTransactionObject(Number(this.state.subtotal), Number(this.calculateTax(Number(this.state.salesTaxRate), Number(this.state.subtotal))), Number(this.state.shipping), Number(this.calculateTotalBill(Number(this.state.subtotal), Number(this.state.shippingCost), Number(this.state.quantity), Number(this.state.salesTaxRate))))} />
              </div>
            </div>
          </div>

          <Footer />
          <Head>
            <title>
              Alta Redwood Store - checkout page
            </title>
            <script src="https://js.stripe.com/v3/"></script>
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
            p#statement {
              font-size: calc(0.9rem);
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
            div.checkout, section#checkoutFormSection {
              outline-style: none;
            }
            div.a section#checkoutFormSection input {
              margin-right: calc(23pt + 0.21vw);
              margin-bottom: calc(3pt + 1vw);
            }
            div#cartContainer {
              margin-left: calc(0.9vw);
            }
            .box {
              background-color: #faf5f5;
              color: #0d0909;
              border-radius: 5px;
              padding: 20px;
              font-size: 150%;
            }
            @media (min-width: 760px) {
              .wrapper {
                display: grid;
                grid-gap: 10px;
                grid-template-columns: [col1-start] 350px  [col2-start] 300px  [col3-start] 300px [col3-end];
                grid-template-rows: [row1-start] auto [row2-start] auto [row2-end];
                background-color: #fff;
                color: #0d0909;
              }
              .a {
                grid-column: col1-start / col3-start;
                grid-row: row1-start;
                font-family: var(--uiFonts, sans-serif);
              }
              .b {
                grid-column: col3-start;
                grid-row: row1-start / row2-end;
                font-family: var(--contentFonts, sans-serif);
              }
              .c {
                grid-column: col1-start / col2-start;
                grid-row: row2-start;
                font-size: calc(0.8rem);
                width: calc(22vw + 170pt);
              }
              .d {
                display: none;
              }
              div.a section#checkoutFormSection input {
                width: calc(20pt + 19vw);
                height: calc(1vh + 30pt);
              }
              section#checkoutFormSection {
                width: calc(20pt + 32vw);
              }
              div.checkout {
                width: calc(20pt + 32vw);
              }
              div.checkout button, button.ecommerce {
                margin-top: calc(2vh + 10pt);
                width: calc(13pt + 5vw);
                height: calc(5pt + 4vh)
              }
            }
            @media (max-width: 761px) {
              button#check {
                width: 200px;
                height: 45px;
              }
              .c {
                font-size: calc(0.8rem);
              }
              .d {
                display: none;
              }
            }
            span#taxInfo, span#shippingInfo, b.shippingInfo, span#shipping, span.taxBill, b#subtotal {
              font-size: calc(0.8rem);
            }
            ul#itemsList li, p#terms {
              font-size: calc(0.95rem);
            }
            p#note {
              font-size: calc(0.92rem);
            }
            h6#tax, h6.details, h6#items, h6#bill, h6#coupon, h6#shipping {
              font-size: calc(0.9rem);
              margin-bottom: 0px;
            }
            div.example {
              background: #fcfcfc;
            }
            span.label {
              margin-right: calc(2vw + 7pt);
            }
            span.label2 {
              margin-right: calc(0.1vw + 1pt);
            }
          `}
          </style>
        </div>
      )
    }
    else {
      setTimeout(() => {
        this.setState({ inventoryMessage: 'quantity not available' })
      }, 5500)
      return (
        <React.Fragment>
          <section id="home"><a href="../.."><span>🏠</span></a></section>
          <div id="cartContainer">
            <Cart />
          </div>
          <motion.div animate={{
            scale: [1, 2, 2, 1, 1],
            borderRadius: ["20%", "20%", "50%", "50%", "20%"],
          }}>
            <h3 id="checkoutNotAvailable">
              Inventory status: {this.state.inventoryMessage.toString()}
            </h3>
          </motion.div>
          <button id="backButton" href="#" onClick={this.goBack}>
            ⬅️ back
          </button>
          <style>{`
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
              padding-top: 0px;
            }
            h3#checkoutNotAvailable {
              font-family: var(--uiFonts, monospace);
              background: #f2f0e9;
              margin-right: calc(23pt + 0.21vw);
              margin-bottom: calc(3pt + 1vw);
              width: calc(80vw);
              height: calc(55vh);
              font-size: calc(2.5rem);
              margin-left: 7px;
              margin-right: 0px;
              padding-top: 6px;
            }
            button#backButton, #cartContainer, section#home {
              font-family: var(--serifFonts, serif);
              margin-left: 7px;
            }
          `}</style>
        </React.Fragment>
      )
    }
  }


}

export default view(Checkout);
