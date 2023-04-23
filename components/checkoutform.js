import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import cartstore from '../components/cartstore';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = { complete: false };
    this.submit = this.submit.bind(this);
    this.state.msg = 'Enter your credit card here to make your purchase';
  }

  submit = async (ev) => {
    let { token } = await this.props.stripe.createToken({ name: "Name" });
    let dest = "/charge/order/" + this.props.orderObject + "/shipping/" + this.props.shippingObject + "/transaction/" + this.props.transactionObject
    console.log(dest);
    this.setState({ msg: "Your purchase is being processed right now..." });

    if (token) {
      let response = await fetch(dest, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: token.id,
        params: { yas: "OK" }
      });
      if (response.ok) {
        console.log("Purchase Complete!");
        this.setState({ msg: "Your purchase has been successfully processed" });
        document.getElementById("check").style.display = "none";
        cartstore.resetCart();
      }
      else {
        console.log("Purchase Was Not Successful!");
        this.setState({ msg: "Processing Error: Your purchase has not been able to be processed" });
      }
    }
    else {
      console.log("Purchase Was Not Successful!");
      this.setState({ msg: "Card Error: Your purchase has not been able to be processed" });
    }
  }

  render() {
    if (this.state.complete) return <h1>Purchase Complete</h1>;

    return (
      <div className="checkout">
        <p>{this.state.msg}</p>
        <CardElement />
        <button id="check" onClick={this.submit}>Purchase</button>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
