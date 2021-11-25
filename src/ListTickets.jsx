import React, { Component } from 'react';

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
      // seats: 0, 
      from_date: '',
      to_date: '',
      // price: ''
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
      seats: []
    }

  }
  bookReturn = () => {
    console.log(this.state)
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
    }).then(res => {
      alert(res)
    })
    
  }
  handleRadioChange = (type) => {
    this.setState({ticketType: type});
  }

  updateResults = (type) => {
    let arrivalDate = this.state.all_tickets.find((ticket) => 
    ticket.inbound == this.state.inbound && 
    ticket.outbound == this.state.outbound &&
    ticket.price == price && 
    ticket.from_date == option &&
    !ticket.booked )
  }
  listItem  = (props) => {
    return  Object.keys(props).map((option, index)=>{
              return props[option].map(price => {
                let arrivalDate = this.state.all_tickets.find((ticket) => 
                ticket.inbound == this.state.inbound && 
                ticket.outbound == this.state.outbound &&
                ticket.price == price && 
                ticket.from_date == option &&
                !ticket.booked )
               return (<div><p>{option +" "+ price+' '+ arrivalDate.to_date}</p><button onClick={() => this.showDialog(option, price)}>test</button></div>)
              })
            })
  };

  listReturnFlights  = (props) => {
    //return  Object.keys(props).map((option, index)=>{
              return props.map(option => {
                let arrivalDate1 = this.state.all_tickets.find((ticket) => 
                ticket.inbound == this.state.inbound && 
                ticket.outbound == this.state.outbound &&
                ticket.price == option.price1 && 
                ticket.from_date == option.singleDate &&
                !ticket.booked )
                let arrivalDate2 = this.state.all_returns.find((ticket) => 
                ticket.outbound == this.state.inbound && 
                ticket.inbound == this.state.outbound &&
                ticket.price == option.price2 && 
                ticket.from_date == option.returnDate &&
                !ticket.booked )
                console.log(arrivalDate2)
               return (
                <div>
                  <div>
                      <p>{this.state.inbound +" -> "+ this.state.outbound}</p>
                      <p>{option.singleDate +" -> "+ arrivalDate1.to_date}</p>
                      <p>{option.price1}</p>
                  </div>
                  <div>
                      <p>{this.state.outbound +" -> "+ this.state.inbound}</p>
                      <p>{option.returnDate +" -> "+ arrivalDate2.to_date}</p>
                      <p>{option.price2}</p>
                  </div>
                  <button onClick={() => this.showReturnDialog(option)}>test</button>

                </div>
                )
              })
    //        })
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
  showDialog = (date, price) => {
    let seats = this.state.all_tickets.filter(el => el.from_date == date && price == el.price && !el.booked).map(el => el.seat)
    this.setState({
      fromDate: date,
      priceChosen: price,
      seats: seats,
      showBookDialog: true
      });
  }
  showReturnDialog = (option) => {
    let seats = this.state.all_tickets.filter(el => el.from_date == option.singleDate && option.price1 == el.price && !el.booked).map(el => el.seat)
    let return_seats = this.state.all_returns.filter(el => el.from_date == option.returnDate && option.price2 == el.price && !el.booked).map(el => el.seat)
    
    this.setState({
      fromDate: option.singleDate,
      fromDateReturn: option.returnDate,
      priceChosen: option.price1,
      returnPriceChoosen: option.price2,
      return_seats: return_seats,
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
        let ticketItems = []
        let dates = [...new Set(body.map(x => x.from_date))]
        dates.forEach(elem => {
          ticketItems[elem] = [...new Set(body.filter(x => x.from_date == elem && !x.booked).map(j => j.price))]
        })
        // useEffect(() => { setTicketItems(ticketItems) }, [])

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
              let returns = []
              let returnDates = [...new Set(tickets.map(x => x.from_date))]
              returnDates.forEach(elem => {
                returns[elem] = [...new Set(tickets.filter(x => x.from_date == elem && !x.booked).map(j => j.price))]
              })
              let oneWay = this.state.ticketItems
              //console.log(oneWay, returns)
              Object.keys(oneWay).forEach(single => {
                for (let i = 0; i < oneWay[single].length; i++){
                  Object.keys(returns).forEach(ret => {
                    for (let j = 0; j < returns[ret].length; j++){
                      let pair = {
                        singleDate: single,
                        price1: oneWay[single][i],
                        returnDate: ret,
                        price2: returns[ret][j]
                      }
                      //console.log(pair)
                      pairs.push(pair)
                    }
                  })
                }

              })
                this.setState({
                  all_returns: tickets,
                  tickets_return: pairs
                })
                console.log('1', this.state)
            }).then(()=> {
              this.setState({
                tickets_return: pairs
              })
              console.log('1', this.state)
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