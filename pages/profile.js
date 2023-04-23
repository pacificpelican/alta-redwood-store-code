import React, { Component } from 'react';
import Menu from "./menu";

import Avatar from "boring-avatars";

//  import Trike from "../img/parrot2";

import { store, view } from 'react-easy-state';

import cartstore from "../components/cartstore";

import CartCard from "./cartCard";
import Cart from "./cart";

import moment from "moment";

import Head from 'next/head';
import Footer from "./footer";

class Profile extends Component {
  state = { username: 'Not Logged In', orders: [] }

  runDBlookup(dbOBJ, db = 'seisdb') {
    let that = this;
    let dest = "/getprofile"
    console.log("FETCH REQUEST URL:")
    console.log(dest);
    fetch(dest, {})
      .then(function (response) {
        if (response.ok) {
          console.log(typeof response);
          console.log(response);
          if (typeof response !=='object') {
            console.log("RESPONSE FROM /getprofile is NOT AN OBJECT");
          }
          if (response.redirected) {
            console.log("no user profile info, not logged in")
            return [{username: "NOT LOGGED IN"}];
          }
          else {
            return response.json();
          }
        }
        throw new Error("Network did not respond.");
        return response.blob();
      })
      .then(function (myReturn) {
        that.setState({ username: myReturn[0].username });
      });

    let dest2 = "/getorders"
    console.log("FETCH REQUEST URL:")
    console.log(dest2);
    fetch(dest2, {})
      .then(function (response) {
        if (response.ok) {
          if (response.redirected) {
            console.log("no user profile info, not logged in")
            return [{transaction: {total: 0 }, cart: { productID: 0, quantity: 0, productName: "none", addedToCartDateTime: 1576729292458 }}];
          }
          else {
            return response.json();
          }
        }
        throw new Error("Network did not respond.");
        return response.blob();
      })
      .then(function (myReturn) {
        that.setState({ orders: myReturn });
      });
  }

  componentDidMount() {
    this.runDBlookup('users_collection');
    setTimeout(() => {
      cartstore.getCartFromLocalStorage();
    }, 5000)
  }

  render(props) {
    console.log(this.props);
    return (
      <div id="parrotsProfileContainer">
        <Menu />
        <div id="profileInfo">Alta Redwood Store User Profile for {this.state.username}</div>
        <div id="cartHeader">
          <Cart />
        </div>
        <hr className="spacer" />
        <div>
          <h4>Your orders</h4>
          {this.state.orders.reverse().map((oo) => {
            console.log(oo.cart);
            let truecart = Object.values(oo.cart);
            console.log(truecart);
            return (
              <section className="oneOrder">
                <span className="date">Order Date: {moment((oo.created_at_time)).format('YYYY-MM-DD HH:mm:ss')}</span>
                <span className="total">Total ${oo.transaction.total}</span>
                <span className="orderID">Order ID #{oo._id}</span>
                <span className="shipped">Shipped? {oo.shipped}</span>
                <span className="items">Items:</span>
                {truecart.map((ii) => {
                  console.log("ii");
                  console.log(ii);
                  if (ii.length == 0) {
                    return <div id="no-informer">0 items</div>
                  }
                  else {
                    return <CartCard carddata={ii} />
                  }
                })}
              </section>
            )
          })}
        </div>
        <hr className="spacer" />
        {/* <Trike /> */}
        <aside id="userAvatar">
          <Avatar 
            size={50}
            name={this.state.username}
            variant="sunset"
            colors={["#5d0000", "#b65e11", "#e29a19", "#f78b01", "#fdf80c"]}
          />
        </aside>
        <Footer />
        <Head>
          <title>
            Alta Redwood Store - user profile page
          </title>
        </Head>
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
          div#parrotsProfileContainer {
            font-family: var(--uiFonts, monospace);
            margin-left: calc(1vw + 5pt);
          }
          div#profileInfo {
            background: OldLace;
          }
          div#cartHeader a {
            color: inherit;
          }
          span.orderID, span.shipped, span.total, span.date, span.items {
            display: block;
            margin-bottom: calc(0.2vw + 3pt);
          }
          section.oneOrder {
            display: block;
            margin-bottom: calc(3vw + 5vh + 3pt);
          }
        `}
        </style>
      </div>
    );
  }
}

export default view(Profile);
