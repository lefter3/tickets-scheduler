import React, {useState, useEffect, Component } from 'react';

export default class ListTickets extends Component {
  constructor() {
    super();
    this.state = {
      inbound: '',
      outbound: '',
      // seats: 0, 
      from_date: '',
      to_date: '',
      // price: ''
      ticketItems: [],
      showBookDialog: false
    }

  }


  listItem  = (props) => {
    console.log(props)
    return  Object.keys(props).map((option, index)=>{
              return props[option].map(price => {
               return (<div><p>{option +" "+ price}</p><button onClick={this.showDialog(option, price)}>test</button></div>)
              })
            })
  };

  showDialog =() => {
    
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
          ticketItems[elem] = [...new Set(body.filter(x => x.from_date == elem).map(j => j.price))]
        })
        // useEffect(() => { setTicketItems(ticketItems) }, [])

        this.setState({
          ticketItems: ticketItems
        }, ()=>{
        console.log(this.state)
        this.forceUpdate();

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
                  Modal Title
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
                <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                  I always felt like I could do anything. That’s the main
                  thing people are controlled by! Thoughts- their perception
                  of themselves! They're slowed down by their perception of
                  themselves. If you're taught you can’t do anything, you
                  won’t do anything. I was taught I could do everything.
                </p>
              </div>
              {/*footer*/}
              <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
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
              </div>
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