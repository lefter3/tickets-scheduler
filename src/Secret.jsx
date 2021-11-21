import React, { Component } from 'react';

export default class Secret extends Component {
  constructor() {
    super();
    this.state = {
      message: 'Loading...'
    }
  }

  componentDidMount() {
    fetch('/api/secret')
      .then(res => res.text())
      .then(res => this.setState({message: res}));
  }
  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }
  render() {
    return (
      <form onSubmit={this.onSubmit} className=''>
        <h1>Login Below!</h1>
        <input
          type="text"
          name="inbound"
          placeholder="Enter email"
          value={this.state.email}
          onChange={this.handleInputChange}
          required
        />
        <input
          type="text"
          name="outbound"
          placeholder="Enter password"
          value={this.state.password}
          onChange={this.handleInputChange}
          required
        />
        <input type="submit" value="Submit"/>
      </form>
    );
  }
}