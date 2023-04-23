import React, { Component } from 'react'
import Menu from "./menu";
import { withRouter } from 'next/router';

class Registered extends Component {
  state = {message: ''}

  getQueryData() {
    const {router} = this.props;
    const message = router.query.message;
    this.setState({message: message});
  }
 
  componentDidMount() {
    this.getQueryData();
  }

  render (props) {
    return (
      <React.Fragment><Menu /><h3>You have created a new account</h3><section>You can now <a href="../login">log in</a> to your account.</section><div>{this.state.message}</div></React.Fragment>
    )
  }
}

export default withRouter(Registered);
