import React, { Component } from 'react';
import { Formik } from 'formik';

import { withRouter } from 'next/router';

import Headernav from "./menu";
import Footernav from "./footer";

class AdminUpdateInventory extends Component {
  defaultFormState = {
    productID: '',
    total: ''
  }
  state = { items: [], productString: '' }

  constructor(props) {
    super();
  }

  sendFormToAPI_items(datastring) {
    let dest = "/create/store-item/" + datastring.toString();
    console.log("fetch save request: " + dest);
    fetch(dest, { method: "post" })
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
      });
  }

  createInventoryData(itemLocator, count) {
    const table = "store_inventory";
    let storeItemObject = Object.assign({}, { itemLocator: itemLocator, total: count });
    let newdataString = encodeURIComponent(JSON.stringify(storeItemObject));
    let dest = "/create/new-item/" + newdataString + "/" + table;
    console.log("fetch save request: (creating inventory data" + dest);
    fetch(dest, { method: "post" })
      .then(function (response) {
        if (response.ok) {
          console.log("response ok (upsertInventoryData)");

          return response.json();
        } else {
          throw new Error(response.Error);
        }
      })
      .then(function (myReturn) {
        console.log(myReturn);
      });
  }

  goBack() {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  }

  handleSubmit = (form) => {
    console.log(form);
    console.log(form.productID);
    console.log(form.total);

    this.createInventoryData(form.productID, form.total);
  }

  render() {
    const { router } = this.props;
    console.log(router);

    let initObject = { productID: router.query.productID, total: '' };
    console.log("init object: " + initObject);
    console.log(initObject);
    return (
      <div id="parrotsAdminCreateProduct">
        <Headernav />
        <button id="backButton" href="#" onClick={this.goBack}>
          ⬅️ back
        </button>
        <section id="items">
          <h3>Inventory - create or update total</h3>
          <Formik
            onSubmit={this.handleSubmit}
            initialValues={initObject}
            validate={null}
          >
            {({
              handleSubmit,
              values,
              handleChange,
              handleBlur
            }) => (
                <form id="itemsForm"
                  onSubmit={handleSubmit}
                >
                  <input
                    value={values.productID}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="productID"
                    type="string"
                    placeholder="ID of product"
                    required
                  />
                  <input
                    value={values.total}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="total"
                    type="string"
                    placeholder="total inventory"
                    required
                  />
                  <button id="inventorySubmitButton">
                    Submit
                  </button>
                </form>
              )}
          </Formik>
        </section>
        <Footernav />
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
          input {
            width: calc(12pt + 8vw);
            height: calc(6pt + 3vh);
            font-size: calc(1.2rem);
          }
          button#backButton {
            height: calc(1rem + 10pt);
          }
          button#inventorySubmitButton {
            height: calc(1.6rem + 10pt);
          }
		    `}
        </style>
      </div>
    )
  }
}

export default withRouter(AdminUpdateInventory);