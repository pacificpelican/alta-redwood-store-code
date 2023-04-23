import React, { useState, useEffect } from 'react';

import Head from 'next/head';

export default function (props) {
  const [item, setItem] = useState([]);

  useEffect(() => {
    if (props.meteor) {
      let g = document.getElementById('comet');
      g.classList.add("spin");
    }
    let dest = "/gettransactions";
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
    <div id="portfolioContainer">
      <header id="headContainer" className="strawberry-banana outline-dotted-thick os-5 georgia">
        <h5>Transactions</h5>
      </header>

      <main id="portfolioInfo">

        <table id="transactions">
          <thead>
            <tr className="transacations_items" id="transactions__items__head">
              <td className="header_item transacations_items_column __tDate">date</td>
              <td className="header_item transacations_items_column __id">id</td>
              <td className="header_item transacations_items_column __symbol">symbol</td>
              <td className="header_item transacations_items_column __amount">amount</td>
              <td className="header_item transacations_items_column __tType">type</td>
            </tr>
          </thead>
          <tbody>
            {item.reverse().map((transaction) => {
              return (
                <tr className="transacations_items" id="transactions__items__body">
                  <td className="body_item transacations_items_column __tDate">{Date(transaction.created_at_time.toString()).toLocaleString()}</td>
                  <td className="body_item transacations_items_column __id"> {transaction.clientID}</td>
                  <td className="body_item transacations_items_column __symbol">{transaction.stockSymbol.toUpperCase()}</td>
                  <td className="body_item transacations_items_column __amount">{transaction.sharesTotal}</td>
                  <td className="body_item transacations_items_column __tType">{transaction.transactionType}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </main>
      <br />
      <Head>
        <title>
          AltaRedwood.com
        </title>
      </Head>

      <style>
        {`
          span#mangoBrokerage {
            font-size: calc(1.7rem);
          }
          #menuContainer {
            margin-left: calc(5pt + 0.7vw);
          }
          table#transactions {
            background: #f0f0f5;
          }
          main#portfolioInfo table#transactions td {
            width: calc(10pt + 15vw);
            padding-right: calc(1vw + 6pt);
            padding-top: calc(1vh + 6pt);
            border-style: outset;
            border-color: silver;
            font-family: Hack, Fira Code, Inconsolata, Anonymous Pro, Menlo, monospace;
          }
        `}
      </style>
    </div>
  )
}
