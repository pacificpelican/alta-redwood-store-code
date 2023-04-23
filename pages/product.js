import React, { useEffect, useState } from 'react';
import Card from './card';
import Menu from "./menu";
import Footer from "./footer";

import { useRouter } from 'next/router';
import { store, view } from 'react-easy-state';

function Product() {
  const router = useRouter();
  let routedData = router.query.product;
  const [item, setItem] = useState([]);

  useEffect(() => {
    console.log(router);
    console.log(routedData);

    let dest = "/api/1/getstoreitem/" + routedData;
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
    <div id="productPageContainer">
      <Menu />
      <div className="cardContainer">
        <Card spreadsheetdata={item[0]} />
      </div>
      <Footer />
      <style>{`
        .cardContainer {
          width: calc(96vw + 10pt);
        }
        div#productPageContainer {
          margin-left: calc(0.9vw);
        }
        a {
          color: inherit;
        }
      `}</style>
    </div>
  )
}

export default view(Product);
