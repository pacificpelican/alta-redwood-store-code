import React, { Component } from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import CheckoutForm from '../components/checkoutform';

class App extends Component {
  constructor(props) {
    super();
    this.state = { stripe: null };
  }
  static getInitialProps(moar) {
    return (
      {}
    )
  }
  componentDidMount() {
    // Create Stripe instance in componentDidMount
    // (componentDidMount only fires in browser/DOM environment)
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        if (window.location.toString().includes(`localhost`)) {
          this.setState({ stripe: window.Stripe(process.env.NEXT_PUBLIC_TEST_PUBLISHABLE_KEY) });
        }
        else {
          // production key
          this.setState({ stripe: window.Stripe(process.env.NEXT_PUBLIC_PUBLISHABLE_KEY) });
        }
      }
    }, 1700)

  }
  render(props) {
    return (
      <StripeProvider stripe={this.state.stripe}>
        <div className="example">

          <Elements>
            <CheckoutForm orderObject={this.props.order} shippingObject={this.props.shipping} transactionObject={this.props.transaction} />
          </Elements>
        </div>
      </StripeProvider>
    );
  }
}

export default App;
