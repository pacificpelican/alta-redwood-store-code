import React from 'react';

import { store, view } from 'react-easy-state';

function cartCard(props) {
  console.log("props.carddata");
  console.log(props.carddata);
  return (
    <React.Fragment>
      <section className="cartCardItem">
        <span className="productName">{props.carddata ? props.carddata.productName : ''}</span>{" "}
        <span className="productQ">{props.carddata ? props.carddata.quantity : ''}</span>
      </section>
      <style>
        {`
          section.cartCardItem {
            font-family: "Ubuntu Mono", "Anonymous Pro", monospace;
          }
          span.productName, span.productQ {
            display: inline-block;
            width: calc(80pt + 10vw);
          }
        `}
      </style>
    </React.Fragment>
  )
}

export default view(cartCard);
