import React, { Component } from 'react';

export default class Secret extends Component {
  constructor() {
    super();
    this.state = {
      inbound: '',
      outbound: '',
      seats: 0, 
      from_date: '',
      to_date: '',
      price: ''
    }
  }
  onSubmit = (event) => {
    event.preventDefault();
    fetch('/api/tickets', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status === 200) {
        //this.props.history.push('/');
        alert('tickets created')
      } else {
        const error = new Error(res.error);
        throw error;
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error logging in please try again');
    });
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
        <h1>Create Tickets</h1>
        <input
          type="text"
          name="inbound"
          placeholder="Inbound"
          value={this.state.inbound}
          onChange={this.handleInputChange}
          required
        />
        <input
          type="text"
          name="outbound"
          placeholder="Outbound"
          value={this.state.outbound}
          onChange={this.handleInputChange}
          required
        />
        <label>Departure
        <input
          type="datetime-local"
          name="from_date"
          placeholder="Departure"
          value={this.state.from_date}
          onChange={this.handleInputChange}
          required
        />
        </label>
        <label>Arrival
        <input
          type="datetime-local"
          name="to_date"
          placeholder="Arrival"
          value={this.state.to_date}
          onChange={this.handleInputChange}
          required
        />
        </label>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={this.state.price}
          onChange={this.handleInputChange}
          required
        />
        <input
          type="text"
          name="seats"
          placeholder="Seats"
          value={this.state.seats}
          onChange={this.handleInputChange}
          required
        />
        <input type="submit" value="Submit"/>
      </form>
    );
  }
}