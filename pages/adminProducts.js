import React, { Component } from "react";

import Link from "next/link";

const objectToArray = require('object-to-array');

import moment from "moment";

class AdminOrders extends Component {

  table = null;
  state = { products: [] }

  constructor(props) {
    super();
  }

  getProductsData() {
    let dest = "/api/1/getstoreitems/limit/50";
    let that = this;
    fetch(dest, { method: "get" })
      .then(function (response) {
        if (response.ok) {
          console.log("response ok (get store products)");

          return response.json();
        } else {
          throw new Error(response.Error);
        }
      })
      .then(function (myReturn) {
        console.log(myReturn);
        that.setState({ products: myReturn });
      });
  }

  componentDidMount() {
    this.getProductsData();
  }

  render(props) {
    let theStore = this.props.store;
    let theTable = this.props.table;

    return (
      <div id="admininadesk" className="mlBench-content">
        <h3>Products</h3>
        <section id="orders">
          {this.state.products.map((mv) => {
            let d = new Date(0);
            return (
              <React.Fragment>
                <section className="ordersList">
                  <table className="orderInfoX">
                    <thead>
                      <tr>
                        <td>
                          title
                        </td>
                        <td>
                          price
                        </td>
                        <td>
                          supplier
                        </td>
                        <td>
                          description
                        </td>
                        <td>
                          image
                        </td>
                        <td>
                          hidden
                        </td>
                        <td>
                          created_at_time
                        </td>
                        <td>
                          locator
                          {" "}
                          <Link
                            href={{
                              pathname: "/View",
                              query: {
                                tuple: mv.locator,
                                val: Number(mv.price),
                                store: theStore,
                                table: theTable,
                                objprop: "price"
                              }
                            }}
                          >
                            <a><span id="pin" type="emoji">📌</span></a>
                          </Link>
                          {" "}
                          <Link
                            href={{
                              pathname: "/Delete",
                              query: {
                                tuple: mv.locator,
                                val: Number(mv.price),
                                store: theStore,
                                table: theTable,
                                objprop: "price"
                              }
                            }}
                          >
                            <a><span id="RedX" type="emoji">❌</span></a>
                          </Link>
                        </td>
                        <td className="productID">
                          id
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {mv.title}
                          {" "}
                          <Link
                            href={{
                              pathname: "/Edit",
                              query: {
                                tuple: mv.locator,
                                val: mv.title,
                                store: theStore,
                                table: theTable,
                                objprop: "title"
                              }
                            }}
                          >
                            <a><span id="pen" type="emoji">🖊</span></a>
                          </Link>
                        </td>
                        <td>
                          {mv.price}
                          <Link
                            href={{
                              pathname: "/Edit",
                              query: {
                                tuple: mv.locator,
                                val: Number(mv.price),
                                store: theStore,
                                table: theTable,
                                objprop: "price"
                              }
                            }}
                          >
                            <a><span id="pen" type="emoji">🖊</span></a>
                          </Link>
                          {" "}
                        </td>
                        <td>
                          {mv.supplier}
                          <Link
                            href={{
                              pathname: "/Edit",
                              query: {
                                tuple: mv.locator,
                                val: mv.supplier,
                                store: theStore,
                                table: theTable,
                                objprop: "supplier"
                              }
                            }}
                          >
                            <a><span id="pen" type="emoji">🖊</span></a>
                          </Link>
                          {" "}
                        </td>
                        <td>
                          {mv.description}
                          {" "}
                          <Link
                            href={{
                              pathname: "/Edit",
                              query: {
                                tuple: mv.locator,
                                val: mv.description,
                                store: theStore,
                                table: theTable,
                                objprop: "description"
                              }
                            }}
                          >
                            <a><span id="pen" type="emoji">🖊</span></a>
                          </Link>
                        </td>
                        <td>
                          {mv.image}
                          {" "}
                          <Link
                            href={{
                              pathname: "/Edit",
                              query: {
                                tuple: mv.locator,
                                val: mv.image,
                                store: theStore,
                                table: theTable,
                                objprop: "image"
                              }
                            }}
                          >
                            <a><span id="pen" type="emoji">🖊</span></a>
                          </Link>
                        </td>
                        <td>
                          {mv.hidden}
                          {" "}
                          <Link
                            href={{
                              pathname: "/Edit",
                              query: {
                                tuple: mv.locator,
                                val: mv.hidden,
                                store: theStore,
                                table: theTable,
                                objprop: "hidden"
                              }
                            }}
                          >
                            <a><span id="pen" type="emoji">🖊</span></a>
                          </Link>
                        </td>
                        <td>
                          {moment(mv.created_at_time).format('dddd, MMMM Do, YYYY h:mm:ss A')}
                        </td>
                        <td>
                          {mv.locator}
                        </td>
                        <td>
                          {mv._id}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <br />
                  <div className="orderProducts">
                  </div>
                  <br />
                </section>
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
          table.orderInfoX, table.orderInfoTransaction, table.OneOrderInfo, table.addressInfo {
            background: #eaeae5;
            font-family: "Ubuntu Mono", "Inconsolata", "Hack", "Fira Code",
              Menlo, monospace;
          }
          table.orderInfoX td, table.orderInfoTransaction td, table.OneOrderInfo td, table.addressInfo td {
            padding-right: calc(1vw + 2pt);
            line-height: 1.3;
          }
          p.shipped {
            font-family: Lato, Open Sans, Ubuntu Sans, Segoe UI, -apple-system,system-ui, BlinkMacSystemFont, Lucida Grande, sans-serif;
          }
          .isItShippedTho {
            padding: 3px 3px 3px 3px;
            background: #d7d9e0;
          }
          table.orderInfoX tbody a span {
            font-size: calc(0.75rem);
          }
        `}</style>
      </div>
    );
  }
}

export default AdminOrders;
