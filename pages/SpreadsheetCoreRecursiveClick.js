//  okconcept0 SpreadsheetCoreRecursiveClick copyright 2017-2018
//  SpreadsheetCoreRecursiveClick.js
//  mlBench & danmckeown.info
import React, { Component } from "react";
import Link from "next/link";

let lastkey = null;

function math_floor_random_number(scale) {
	var newdigit = Math.floor((Math.random() * scale) + 1);
	return newdigit;
}

class ProductsDisplay extends Component {
  table = null;

  render(props) {
    let theStore = this.props.store;
    let theTable = this.props.table;

    var g = [];
    if (this.props) {
      if (this.props.spreadsheetdata) {
        if (this.props.spreadsheetdata[0] !== undefined) {
          g = [{}, ...this.props.spreadsheetdata];
        } else {
          g = [this.props.spreadsheetdata];
        }
      }
    }

    return (
      <div id="desk" className="mlBench-content" key={math_floor_random_number(3333)}>
        <section id="products">
          <span><h3>Products List</h3></span>
        </section>
        <section className="keylibrary">
          {g.map(function (interVal) {
            let valArr = Object.keys(interVal);

            let retSet = [];

            for (let i = 0; i < valArr.length; i++) {
              if (typeof valArr[i] === "object") {
                //         do nothing
              } else {
                retSet.push(
                  <span key={valArr[i]} className="valHeaderRow">
                    {valArr[i] + " "}
                  </span>
                );
              }
            }
          })}
        </section>
        <section className="datalibrary">
          {g.map(function (interVal) {
            let keyArr = Object.keys(interVal);
            let valArr = Object.values(interVal);

            let retSet = [];

            for (let i = 0; i < keyArr.length; i++) {
              if (keyArr[i] === "locator") {
                lastkey = valArr[i];
              }
              if (typeof keyArr[i] === "object") {
                //  do nothing
              } else {
                retSet.push(
                  <span key={keyArr[i]} className="valHeaderRow">
                    {keyArr[i] + " "}
                  </span>
                );
              }
              if (i === keyArr.length - 1) {
                retSet.push(<div key={i + keyArr[i] + valArr[i] + `header`} className="endDividerHead" />);
              }
            }

            for (let i = 0; i < valArr.length; i++) {
              if (typeof valArr[i] === "object") {
                retSet.push(
                  <span key={valArr[i]} className="valSheetRow">
                    <ProductsDisplay
                      spreadsheetdata={valArr[i]}
                      table={theTable}
                      store={theStore}
                    />
                  </span>
                );
              } else {
                let newdata = encodeURIComponent(JSON.stringify(valArr[i]));
                let newdataString = newdata.toString();
                retSet.push(
                  <span key={valArr[i]} className="valSheetRow">
                    <Link
                      href={{
                        pathname: "/Edit",
                        query: {
                          tuple: lastkey,
                          val: newdataString,
                          store: theStore,
                          table: theTable,
                          objprop: keyArr[i]
                        }
                      }}
                    >
                      <a>{valArr[i] + " "}</a>
                    </Link>{" "}
                    <Link
                      href={{
                        pathname: "/View",
                        query: {
                          tuple: lastkey,
                          store: theStore,
                          table: theTable
                        }
                      }}
                    >
                      <a>📌</a>
                    </Link>{" "}
                    <Link
                      href={{
                        pathname: "/Delete",
                        query: {
                          tuple: lastkey,
                          store: theStore,
                          table: theTable
                        }
                      }}
                    >
                      <a>❌</a>
                    </Link>
                    {" "}
                    <Link
                      href={{
                        pathname: "/adminUpdateInventory",
                        query: {
                          productID: lastkey
                        }
                      }}
                    >
                      <a>🚚</a>
                    </Link>{" "}

                  </span>
                );
              }
              if (i === keyArr.length - 1) {
                retSet.push(<div key={i + keyArr[i] + valArr[i] + `valz`} className="endDivider" />);
              }
            }

            return [...retSet];
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
        `}</style>
      </div>
    );
  }
}

export default ProductsDisplay;
