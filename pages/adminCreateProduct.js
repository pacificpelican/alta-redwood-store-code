import React, { Component } from 'react';
import { Formik } from 'formik';

export default class AdminCreateProduct extends Component {
  defaultFormState = {
    title: '',
    price: '',
    supplier: '',
    description: '',
    image: ''
  }
  state = { items: [] }

  sendFormToAPI_items(datastring) {
    let dest = "/create/store-item/" + datastring.toString();
    //  http://localhost:3000/create/store-item/%7B%22title%22%3A%22ladder%22%2C%22price%22%3A10%2C%22supplier%22%3A%22local%20supplier%22%2C%22description%22%3A%22wooden%20ladder%20for%20birds%22%7D
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
  handleSubmit = (form) => {
    console.log(form);
    let newdata = encodeURIComponent(JSON.stringify(form));
    let newdataString = newdata.toString();
    this.sendFormToAPI_items(newdataString);
  }

  render() {
    return (
      <div id="parrotsAdminCreateProduct">
        <section id="items">
          <h3>Products - create new item</h3>
          <Formik
            onSubmit={this.handleSubmit}
            initialValues={this.defaultFormState}
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
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="title"
                  type="string"
                  placeholder="title of product"
                  required
                />
                <br />
                <input
                  value={values.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="price"
                  type="string"
                  placeholder="in dollars"
                  required
                />
                <br />
                <input
                  value={values.supplier}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="supplier"
                  type="string"
                  placeholder="source of product"
                />
                <br />
                <textarea
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="description"
                  type="string"
                  placeholder="describe product"
                />
                <br />
                <input
                  value={values.image}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="image"
                  type="string"
                  placeholder="url of image"
                />
                <br />
                <button id="items">
                  Submit
                </button>
              </form>
            )}
          </Formik>
        </section>
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
          form#itemsForm input, button#items {
            width: calc(32pt + 18vw);
            height: calc(12pt + 5vh);
            font-size: calc(1.25rem);
            margin-bottom: calc(1.3vh);
          }
          form#itemsForm textarea {
            width: calc(32pt + 18vw);
            height: calc(32pt + 5vh);
            font-size: calc(1.25rem);
            margin-bottom: calc(1.3vh);
          }
          div#registerParrots {
            margin-left: calc(1vw + 5pt);
          }
		    `}
        </style>
      </div>
    )
  }
}
