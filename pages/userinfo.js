import React, { Component } from 'react'

let theStyle = {"font-family": '"Ubuntu Mono", "Inconsolata", "Hack", "Fira Code", Menlo, monospace'}

export default class extends Component {
  state = {username: ''}

  runDBlookup(dbOBJ, db = 'seisdb') {
    let that = this;
    let dest = "/getprofile"
    console.log("FETCH REQUEST URL:" + dest);
    fetch(dest, {})
      .then(function (response) {
        if (response.ok) {
          console.log(typeof response);
          console.log(response);

          if (typeof response !=='object') {
            console.log("RESPONSE FROM /getprofile is NOT AN OBJECT");
          }
          if (response.redirected) {
            console.log("no user profile info, not logged in")
            return [{username: "NOT LOGGED IN"}];
          }
          else {
            return response.json();
          }
      
        }
        throw new Error("Network did not respond.");
        return response.blob();
      })
      .then(function (myReturn) {
        console.log("myReturn from /getprofile");
        console.log(myReturn);
        that.setState({ username: myReturn[0].username});
      });
  }
 
  componentDidMount() {
    this.runDBlookup('users_collection');
  }

  render (props) {
    //  console.log(this.props);
    console.log('this.state');
    console.log(this.state);
    if ((this.state.username !== '') && (this.state.username !== 'NOT LOGGED IN')) {
      return(<React.Fragment><div style={theStyle} id="logged"><a href="/profile">Logged In</a> as {this.state.username}</div></React.Fragment>);
    }
    else {
      return(<React.Fragment><div>Not <a href="/login">Logged</a> In</div><style>{`a {color: inherit}`}</style></React.Fragment>);
    }
  }
}
