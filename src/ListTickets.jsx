import React, { Component } from 'react';
import socketClient from "socket.io-client";
const SERVER = "http://127.0.0.1:8080";
export default class ListTickets extends Component {
  constructor() {
    super();
    
    this.state = {
      ticketType: "single",
      seat_nr: null,
      inbound: '',
      outbound: '',
      singleId: null,
      returnId: null,
      from_date: '',
      to_date: '',
      "inbound": "Tirana",
      "outbound": "Paris",
      "from_date": "2021-11-01",
      "to_date": "2021-12-02",
      fromDate: "",
      priceChosen: null,
      fromDateReturn: null,
      all_returns: [],
      return_seat: null,
      tickets_return: [],
      all_tickets: [],
      return_seats: [],
      ticketItems: [],
      showBookDialog: false,
      dialogOption: {},
      seats: []
    
    }

  }
  componentDidMount() {
    var socket = socketClient (SERVER);
    socket.on('connection', () => {
        console.log(`I'm connected with the back-end`);
    });
    socket.on('ticket-booked', data => {
      this.updateResults(data)
    })
}
  bookReturn = () => {
    let oneWay = this.state.all_tickets.find((ticket) => 
    ticket.inbound == this.state.inbound && 
    ticket.outbound == this.state.outbound &&
    ticket.seat == this.state.seat_nr && 
    ticket.from_date == this.state.fromDate &&
    !ticket.booked
    )
    let rTicket = this.state.all_returns.find((ticket) => 
    ticket.inbound == this.state.outbound && 
    ticket.outbound == this.state.inbound &&
    ticket.seat == this.state.return_seat && 
    ticket.from_date == this.state.fromDateReturn &&
    !ticket.booked
    )

    let body = {
      singleId: oneWay._id,
      returnId: rTicket._id
    }
    fetch('/api/tickets/bookReturn', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((err, res) => {
      if (!err){
        alert('Tickets booked')
        this.closedialog()
      }else{
        alert('Tickets not booked')
      }
      
    })
    
  }
  handleRadioChange = (type) => {
    this.setState({ticketType: type});
  }

  updateResults = (ticketIds) => {
    if (this.state.all_tickets.length) {
      let found = this.state.all_tickets.findIndex(x => ticketIds.includes(x._id));
      if  (found){
        let tickets = this.state.all_tickets.map(el => ticketIds.includes(el._id) ? Object.assign(el, {booked: true}) : el)
        let ticketItems = [...new Set(tickets.map(x => JSON.stringify({from: x.from_date, to: x.to_date, price: x.price})))]
          this.setState({
            ticketItems: ticketItems,
            all_tickets: tickets
        })
      }
      
    }
    if (this.state.all_returns.length) {
      let pairs = []
      let found = this.state.all_returns.findIndex(x => ticketIds.includes(x._id));
      if  (found){

        let returnTickets = this.state.all_returns.map(el => ticketIds.includes(el._id) ? Object.assign(el, {booked: true}) : el)
        let returns = [...new Set(returnTickets.map(x => JSON.stringify({from: x.from_date, to: x.to_date, price: x.price})))]
        let oneWay = this.state.ticketItems
        for (let i = 0; i < oneWay.length; i++){
            for (let j = 0; j < returns.length; j++){
              let single = JSON.parse(oneWay[i])
              let ret = JSON.parse(returns[j])
              let pair = {
                singleDateFrom: single.from,
                singleDateTo: single.to,
                price1: single.price,
                returnDateFrom: ret.from,
                returnDateTo: ret.to,
                price2: ret.price
              }
              if (ret.from > single.to){
                pairs.push(pair)
              }
            }
        }
          this.setState({
            all_returns: returnTickets,
            tickets_return: pairs
          })
      }
    }
    if (this.state.showBookDialog){
      if (this.state.ticketType == 'single'){
        this.showDialog(this.state.dialogOption)
      }else {
        this.showReturnDialog(this.state.dialogOption)
      }
    }
  }
  listItem  = (props) => {
      return props.map(option => {
        let ticket = JSON.parse(option)
        return (
        <div>
          <div>
            <p>{this.state.inbound +" -> "+ this.state.outbound}</p>
            <p>{ticket.from +" -> "+ ticket.to}</p>
            <p>{ticket.price}</p>
          </div>
          <button onClick={() => this.showDialog(option)}>test</button>
        </div>)
      })
  };

  listReturnFlights  = (props) => {
    return props.map(option => {
      return (
      <div>
        <div>
            <p>{this.state.inbound +" -> "+ this.state.outbound}</p>
            <p>{option.singleDateFrom +" -> "+ option.singleDateTo}</p>
            <p>{option.price1}</p>
        </div>
        <div>
            <p>{this.state.outbound +" -> "+ this.state.inbound}</p>
            <p>{option.returnDateFrom +" -> "+ option.returnDateTo}</p>
            <p>{option.price2}</p>
        </div>
        <button onClick={() => this.showReturnDialog(option)}>Book</button>

      </div>
      )
    })
  };

  closedialog = () => {
    this.setState({
      showBookDialog: false,
      fromDate: "",
      priceChosen: null,
      fromDateReturn: null,
      returnPriceChoosen: null,
      return_seats: null,
      seats: [],
      });
  }
  showDialog = (option) => {
    let seats = this.state.all_tickets.filter(el => el.from_date == option.from && el.to_date == option.to && price == el.price && !el.booked).map(el => el.seat)
    this.setState({
      fromDate: date,
      priceChosen: price,
      seats: seats,
      dialogOption: option, 
      showBookDialog: true
      });
  }
  showReturnDialog = (option) => {
    let seats = this.state.all_tickets.filter(el => el.from_date == option.singleDateFrom && el.to_date == option.singleDateTo && option.price1 == el.price && !el.booked).map(el => el.seat)
    let return_seats = this.state.all_returns.filter(el => el.from_date == option.returnDateFrom && el.to_date == option.returnDateTo && option.price2 == el.price && !el.booked).map(el => el.seat)
    
    this.setState({
      seat_nr: seats[0],
      return_seat: return_seats[0],
      fromDate: option.singleDateFrom,
      fromDateReturn: option.returnDateFrom,
      priceChosen: option.price1,
      returnPriceChoosen: option.price2,
      return_seats: return_seats,
      seats: seats,
      dialogOption: option, 
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
  let pairs = []
  let data = {
    inbound: this.state.inbound,
    outbound: this.state.outbound,
    from_date: this.state.from_date,
    to_date: this.state.to_date,
  }
    fetch('/api/tickets/search', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      res.json().then(body => {
        let ticketItems = [...new Set(body.map(x => JSON.stringify({from: x.from_date, to: x.to_date, price: x.price})))]
        this.setState({
          ticketItems: ticketItems,
          all_tickets: body
          })

      }).then(()=>{
        if (this.state.ticketType == 'return'){
        let returnData = {
            inbound: this.state.outbound,
            outbound: this.state.inbound,
            from_date: this.state.from_date,
            to_date: this.state.to_date,
          }
          fetch('/api/tickets/search', {
            method: 'POST',
            body: JSON.stringify(returnData),
            headers: {
              'Content-Type': 'application/json'
            }
          }).then((returnTickets)=>{
            
            returnTickets.json().then(tickets => {
              let returns = [...new Set(tickets.map(x => JSON.stringify({from: x.from_date, to: x.to_date, price: x.price})))]
              let oneWay = this.state.ticketItems
              for (let i = 0; i < oneWay.length; i++){
                  for (let j = 0; j < returns.length; j++){
                    let single = JSON.parse(oneWay[i])
                    let ret = JSON.parse(returns[j])
                    let pair = {
                      singleDateFrom: single.from,
                      singleDateTo: single.to,
                      price1: single.price,
                      returnDateFrom: ret.from,
                      returnDateTo: ret.to,
                      price2: ret.price
                    }
                    if (ret.from > single.to){
                      pairs.push(pair)
                    }
                  }
              }
                this.setState({
                  all_returns: tickets,
                  tickets_return: pairs
                })
                //console.log('1', this.state)
            })
            .then(()=> {
            })
          })
        }
      });


      
    })
    .catch(err => {
      console.error(err);
    })
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
        <label>One Way
        <input type="radio" name="type"
        onChange={() => this.handleRadioChange('single')} />
        </label>
        <label>Return
        <input
        type="radio" name="type"
        onChange={() => this.handleRadioChange('return')} />
        </label>
        <input type="submit" value="Submit"/>
      </form>

      <br />
      <div>

        { 
          this.state.ticketType == 'single' ? this.listItem(this.state.ticketItems) : this.listReturnFlights(this.state.tickets_return)
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
                One way seat
                <select 
                name="seat_nr"
                onChange={this.handleInputChange}
                required
                >
                  {this.state.seats.map(seat => (<option value={seat}>{seat}</option>))}
                </select>
                {this.state.ticketType == 'single' ? (<button onClick={() => this.book()}>Book</button>) : null}
              </div>
              { this.state.ticketType == 'return' ? ( <div className="relative p-6 flex-auto">
                Return seat
                <select 
                name="return_seat"
                onChange={this.handleInputChange}
                required
                >
                  {this.state.return_seats.map(seat => (<option value={seat}>{seat}</option>))}
                </select>
                <button onClick={() => this.bookReturn()}>Book</button>
              </div>) : null }
             
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