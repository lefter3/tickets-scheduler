import React, {useState, useEffect, Component } from 'react';

export default class ListTickets extends Component {
  constructor() {
    super();
    this.state = {
      ticketType: "",
      seat_nr: null,
      inbound: '',
      outbound: '',
      // seats: 0, 
      from_date: '',
      to_date: '',
      // price: ''
      "inbound": "Tirana",
      "outbound": "Paris",
      "from_date": "2021-11-01",
      "to_date": "2021-12-01",
      fromDate: "",
      priceChosen: null,
      all_tickets: [],
      ticketItems: [],
      showBookDialog: false,
      seats: []
    }

  }


  listItem  = (props) => {
    return  Object.keys(props).map((option, index)=>{
              return props[option].map(price => {
               return (<div><p>{option +" "+ price}</p><button onClick={() => this.showDialog(option, price)}>test</button></div>)
              })
            })
  };

  closedialog = () => {
    this.setState({
      showBookDialog: false,
      fromDate: "",
      priceChosen: null,
      seats: [],
      });
  }
  showDialog = (date, price) => {
    let seats = this.state.all_tickets.filter(el => el.from_date == date && price == el.price && !el.booked).map(el => el.seat)
    this.setState({
      fromDate: date,
      priceChosen: price,
      seats: seats,
      showBookDialog: true
      });
  }

  book = () => {
    let body = {
      inbound: this.state.inbound,
      outbound: this.state.outbound,
      from_date: this.state.fromDate,
      price: this.state.priceChosen,
      seat: this.state.seat_nr
    }
    fetch('/api/tickets/book', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      alert('Booking done')
    })
  }

  onSubmit = (event) => {
  event.preventDefault();
    fetch('/api/tickets/search', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      res.json().then(body => {
        let ticketItems = []
        let dates = [...new Set(body.map(x => x.from_date))]
        dates.forEach(elem => {
          ticketItems[elem] = [...new Set(body.filter(x => x.from_date == elem && !x.booked).map(j => j.price))]
        })
        // useEffect(() => { setTicketItems(ticketItems) }, [])

        this.setState({
          ticketItems: ticketItems,
          all_tickets: body
          });

      })
    })
    .catch(err => {
      console.error(err);
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
      <div>
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
        <label>From Date
        <input
          type="date"
          name="from_date"
          placeholder="From"
          value={this.state.from_date}
          onChange={this.handleInputChange}
          required
        />
        </label>
        <label>To Date
        <input
          type="date"
          name="to_date"
          placeholder="Arrival"
          value={this.state.to_date}
          onChange={this.handleInputChange}
          required
        />
        </label>
        <input type="submit" value="Submit"/>
      </form>

      <br />
      <div>

        { 
          this.listItem(this.state.ticketItems)
        } 
      </div>
      <br />
      {this.state.showBookDialog ? (
      <>
        <div
          className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        >
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/*header*/}
              <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                <h3 className="text-3xl font-semibold">
                  Choose Seat
                </h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setShowModal(false)}
                >
                  <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>
              {/*body*/}
              <div className="relative p-6 flex-auto">
                <select 
                name="seat_nr"
                onChange={this.handleInputChange}
                required
                >
                  {this.state.seats.map(seat => (<option value={seat}>{seat}</option>))}
                </select>
                <button onClick={() => this.book()}>Book</button>
              </div>
              {/*footer*/}
              {/* <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Save Changes
                </button>
              </div> */}
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    ) : null}
      </div>
        

    );
  }
}