import React, { Component, useState, useEffect } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import withAuth from './withAuth';
import Home from './Home';
import Secret from './Secret';
import CreateTickets from './TicketAdmin';
import SearchTickets from './ListTickets';
import Login from './Login';
import { useLocation } from 'react-router-dom';
import  queryString  from 'query-string';

class App extends Component {
  render() {
    return (
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/secret">Secret</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/tickets">Tickets</Link></li>
          <li><Link to="/list">Search</Link></li>
        </ul>

        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/secret" component={withAuth(Secret)} />
          <Route path="/tickets" component={withAuth(CreateTickets)} />
          <Route path="/list" component={withAuth(SearchTickets)} />
          <Route path="/login" component={Login} />
          <Route path="/register"  >
            <Register />
          </Route>
        </Switch>
      </div>
    );
  }
}
function Register(){
  const [text, setRes] = useState('');
  function response(res) {
    setRes(res);
  }
  // useEffect(() => {
    let { search } = useLocation()
    console.log(search)
    const values = queryString.parse(search)
    console.log(values)
    fetch(`/api/register?email=${encodeURIComponent(values.email)}&password=${values.password}&type=${values.type}`)
    .then(res => {
      console.log(res)
      response(res.statusText)
      // return <p>{this.text}</p>
    })
  // }, []);
    
    return(
      <div>{text}</div>
    );
}
export default App;
