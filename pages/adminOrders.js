//  okconcept0 SpreadsheetCoreRecursiveClick copyright 2017-2018
//  SpreadsheetCoreRecursiveClick.js
//  mlBench & danmckeown.info
import React, { Component } from "react";

import OkViewer from "okconceptviewer";

const objectToArray = require('object-to-array');

import moment from "moment";

class AdminOrders extends Component {
  table = null;
  state = { orders: [] }

  getInventoryData() {
    let dest = "/api/1/getdbdata/db/default/object/store_orders";
    let that = this;
    fetch(dest, { method: "get" })
      .then(function (response) {
        if (response.ok) {
          console.log("response ok (get store inventory)");

          return response.json();
        } else {
          throw new Error(response.Error);
        }
      })
      .then(function (myReturn) {
        console.log(myReturn);
        that.setState({ orders: myReturn });
      });
  }

  markAsShipped(orderLocator) {
    console.log("toDO: mark as shipped " + orderLocator);
    let dest = "/updateorder/locator/" + orderLocator + "/status/yes";
    let that = this;
    fetch(dest, { method: "post" })
      .then(function (response) {
        if (response.ok) {
          console.log("response ok: set status to shipped for order id#" + orderLocator);

          return response.json();
        } else {
          console.log("error updating order status (shipping)");
          throw new Error(response.Error);
        }
      })
      .then(function (myReturn) {
        console.log(myReturn);

      });
  }

  componentDidMount() {
    this.getInventoryData();
  }

  render(props) {

    return (
      <div id="admininadesk" className="mlBench-content">
        <h3>Orders List</h3>
        <section id="orders">
          {this.state.orders.reverse().map((mv) => {
            let d = new Date(0);
            return (
              <React.Fragment>
                <section className="ordersList">
                  <table className="orderInfo">
                    <thead>
                      <tr>
                        <td className="orderID">
                          id
                        </td>
                        <td>
                          username
                        </td>
                        <td>
                          date
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {mv._id}
                        </td>
                        <td>
                          {mv.username}
                        </td>
                        <td>
                          {moment(mv.created_at_time).format('dddd, MMMM Do, YYYY h:mm:ss A')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <br />
                  <table className="addressInfo">
                    <thead>
                      <tr>
                        <td>
                          name
                        </td>
                        <td>
                          address 1
                        </td>
                        <td>
                          address 2
                        </td>
                        <td>
                          city
                        </td>
                        <td>
                          state
                        </td>
                        <td>
                          ZIP
                        </td>
                        <td>
                          phone
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        
                        <td>
                          {mv.shipping.name}
                        </td>
                        <td>
                          {mv.shipping.address1}
                        </td>
                        <td>
                          {mv.shipping.address2}
                        </td>
                        <td>
                          {mv.shipping.city}
                        </td>
                        <td>
                          {mv.shipping.state}
                        </td>
                        <td>
                          {mv.shipping.zip}
                        </td>
                        <td>
                          {mv.shipping.phone}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <br />
                  <div className="orderProducts">
                    {objectToArray(mv.cart).map((theV) => {
                      console.log("theV");
                      console.log(theV);
                      return(
                        <table className="OneOrderInfo">
                          <thead>
                            <tr>
                              <td className="productID">
                                product id
                              </td>
                              <td>
                                quantity
                              </td>
                              <td>
                                product name
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                {theV[1].productID}
                              </td>
                              <td>
                                {theV[1].quantity}
                              </td>
                              <td>
                                {theV[1].productName}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      )
                    })}
                  </div>
                  <br />
                  <div className="orderTransaction">
                    <table className="orderInfoTransaction">
                      <thead>
                        <tr>
                          <td>
                            subtotal
                        </td>
                          <td>
                            tax
                        </td>
                          <td>
                            shipping
                        </td>
                          <td>
                            total
                        </td>
                          <td>
                            COUPON
                        </td>

                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            {mv.transaction.subtotal}
                          </td>
                          <td>
                            {mv.transaction.tax}
                          </td>
                          <td>
                            {mv.transaction.shipping}
                          </td>
                          <td>
                            {mv.transaction.total}
                          </td>
                          <td>
                            {mv.transaction.coupon}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>
                <p className="shipped">
                  Total Transaction: ${mv.transaction.total}
                </p>
                <p className="shipped">
                  Shipped? <span className="isItShippedTho">{mv.shipped}</span>
                </p>
                {"  "}
                { mv.shipped=='no' ? <button id="shipped" onClick={this.markAsShipped.bind(null, mv.locator)}>mark as shipped</button> : <span></span>}
                <hr className="adminOrdersBr" />
              </React.Fragment>
            )
          })}
        </section>
        <style jsx>{`
          :root {
            --monoFonts: "Ubuntu Mono", "Inconsolata", "Hack", "Fira Code",
            Menlo, monospace;
          }
          .spread {
            font-family: "Ubuntu Mono", "Inconsolata", "Hack", "Fira Code",
              Menlo, monospace;
          }
          div#inventoryData {
            font-family: var(--monoFonts, monospace);
            line-height: 1.3;
          }
          .keylibrary {
            display: flex;
            flex-direction: row;
          }
          span.valHeaderRow {
            background-color: lightblue;
            margin-top: 12px;
            margin-right: 10px;
            margin-bottom: 0.6rem;
            line-height: 1.3;
            text-align: left;
            padding-right: calc(1rem + 2.1vw);
            font-family: var(--monoFonts, monospace);
            font-size: calc(0.9rem);
          }
          span.valSheetRow {
            background-color: lightgray;
            margin-top: 12px;
            margin-right: 10px;
            margin-bottom: 0.6rem;
            line-height: 1.3;
            text-align: left;
            padding-right: calc(1rem);
            font-family: var(--monoFonts, monospace);
            font-size: calc(0.9rem);
          }
          span.valSheetRow a {
            text-decoration: none;
            color: black;
          }
          #processed, #shipped {
            background: #f7f7ed;
            width: calc(12vw + 10pt);
            height: calc(8pt + 7vh);
            margin-right: calc(10pt + 2vw);
            border-style: solid;
            font-family: var(--monoFonts, monospace);
            font-size: calc(1.1rem);
          }
          table.orderInfo, table.orderInfoTransaction, table.OneOrderInfo, table.addressInfo {
            background: #eaeae5;
            font-family: "Ubuntu Mono", "Inconsolata", "Hack", "Fira Code",
              Menlo, monospace;
          }
          table.orderInfo td, table.orderInfoTransaction td, table.OneOrderInfo td, table.addressInfo td {
            padding-right: calc(2vw + 20pt);
          }
          p.shipped {
            font-family: Lato, Open Sans, Ubuntu Sans, Segoe UI, -apple-system,system-ui, BlinkMacSystemFont, Lucida Grande, sans-serif;
          }
          .isItShippedTho {
            padding: 3px 3px 3px 3px;
            background: #d7d9e0;
          }
        `}</style>
      </div>
    );
  }
}

export default AdminOrders;
