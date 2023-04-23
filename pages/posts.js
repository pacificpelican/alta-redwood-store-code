import React, { Component } from 'react'

export default class extends Component {
  static getInitialProps ({ query: { id } }) {
    return { postId: id }
  }

  render () {
    return (
      <div>
        <h1>My blog post #{this.props.postId}</h1>
        <p>
          The drab and gritty plains of the Midwestern states stretch out in every direction, hot with rage and colliding in stream with the Lakes.
        </p>
      </div>
    )
  }
}
