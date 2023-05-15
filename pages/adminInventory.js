//  okconcept0 SpreadsheetCoreRecursiveClick copyright 2017-2018
//  SpreadsheetCoreRecursiveClick.js
//  mlBench & danmckeown.info
import React, { Component } from "react";
import Link from "next/link";
import mungeInventory from "../components/mungeInventory2000";

let lastkey = null;

class SpreadsheetCoreRecursiveClick extends Component {
  table = null;
  state = { inventory: [], spreadsheetdata: [], inventory: [], items: [] };

  getInventoryData() {
    let dest = "/api/1/getdbdata/db/default/object/store_inventory";
    let that = this;
    fetch(dest, { method: "get" })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.Error);
        }
      })
      .then(function (myReturn) {
        console.log(myReturn);
        that.setState({ inventory: myReturn });
        let dest2 = "/api/1/getstoreitems/limit/50";
        const theny = that;

        console.log("fetch GET request: " + dest2);
        fetch(dest2, { method: "get" })
          .then(function (response2) {
            if (response2.ok) {
              return response2.json();
            } else {
              throw new Error(response.Error);
            }
          })
          .then(function (myReturn) {
            console.log(myReturn);
            theny.setState({ items: myReturn });
          });
      });
  }

  getDataFromAPI_items() {
    let dest = "/api/1/getstoreitems/limit/50";
    const that = this;

    console.log("fetch GET request: " + dest);
    fetch(dest, { method: "get" })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.Error);
        }
      })
      .then(function (myReturn) {
        console.log(myReturn);
        that.setState({ items: myReturn });
      });
  }

  getProps() {
    this.setState({ spreadsheetdata: this.props.spreadsheetdata });
  }

  componentDidMount() {
    this.getInventoryData();
  }

  render(props) {
    let inventory = this.state.inventory;

    let mungedData = [];

    let spreadsheetdataProps = this.props.spreadsheetdata
      ? this.props.spreadsheetdata
      : [];

    mungedData = mungeInventory(this.state.items, this.state.inventory);

    return (
      <div id="admininvdesk" className="mlBench-content">
        <section id="inventory">
          <span>
            <h2>store inventory</h2>
          </span>
          <div id="inventoryData">
            {mungedData.map(function (inVal) {
              console.log("iterating in adminInventory");
              console.log(inVal);
              return (
                <div>
                  <span>productID: {inVal.productID}</span>{" "}
                  <span>{"  |  "}</span>
                  <span>product title: {inVal.productTitle}</span>{" "}
                  <span>{"  |  "}</span>
                  <span>current total: {inVal.total}</span>
                  <span>{" |  "}</span>
                  <span className="editInventory">
                    <Link
                      href={{
                        pathname: "/adminUpdateInventory",
                        query: {
                          productID: inVal.productID,
                          total: inVal.total
                        }
                      }}
                    >
                      <a>update total</a>
                    </Link>{" "}
                  </span>
                  <span className="Delete">
                    <Link
                      href={{
                        pathname: "/Delete",
                        query: {
                          tuple: inVal.locator,
                          store: "default",
                          table: "store_inventory"
                        }
                      }}
                    >
                      <a id="deleteLatestDeprecated">delete latest record <span className="deprecatedSmallType">deprecated</span></a>
                    </Link>{" "}
                  </span>
                </div>
              );
            })}
          </div>
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
          span.deprecatedSmallType {
            font-size: calc(0.6rem);
            color: darkred;
          }
          #deleteLatestDeprecated {
            font-size: calc(0.7rem);
          }
        `}</style>
      </div>
    );
  }
}

export default SpreadsheetCoreRecursiveClick;
