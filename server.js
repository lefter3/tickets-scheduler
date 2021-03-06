const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
const Ticket = require('./models/Tickets')
const withAuth = require('./middleware');
var cors = require('cors')
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});
//const io = new Server(server);
const secret = 'mysecretsshhh';
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const mongo_uri = 'mongodb://localhost:27017/tickets';
mongoose.connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
  if (err) {
    throw err;
  } else {
    console.log(`Successfully connected to ${mongo_uri}`);
  }
});

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => { /* socket object may be used to send specific messages to the new connected client */

  console.log('new client connected');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/home', function(req, res) {
  res.send('Welcome!');
});

app.get('/api/register', function(req, res) {
  const { email, password, type } = req.query;
  const user = new User({ email, password, type });

  user.save(function(err) {
    if (err) {
      console.log(err);
      res.status(500).send("Error");
    } else {
      res.status(200).send("OK");
    }
  });
});

app.post('/api/authenticate', function(req, res) {
  const { email, password } = req.body;
  let type
  User.findOne({ email }, function(err, user) {
    if (err) {
      console.error(err);
      res.status(500)
        .json({
        error: 'Internal error please try again'
      });
    } else if (!user) {
      res.status(401)
        .json({
        error: 'Incorrect email or password'
      });
    } else {
      type = user.type
      user.isCorrectPassword(password, function(err, same) {
        if (err) {
          res.status(500)
            .json({
            error: 'Internal error please try again'
          });
        } else if (!same) {
          res.status(401)
            .json({
            error: 'Incorrect email or password'
          });
        } else {
          // Issue token
          const payload = { type };
          const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
          });
          res.cookie('token', token, { httpOnly: true }).sendStatus(200);
        }
      });
    }
  });
});

app.get('/checkToken', withAuth, function(req, res) {
  res.sendStatus(200);
});
/////////////////////Tickets///////////////

app.post('/api/tickets', function(req, res) {
  let seats = req.body.seats
  for (i=1; i <= seats; i++) { 
    const { inbound, outbound, from_date, to_date, price } = req.body;
    const ticket = new Ticket({ inbound, outbound, i, from_date, to_date, price });

    ticket.save(function(err) {
      if (err) {
        console.log(err);
      } 
    });
  }
   res.send('ok')
});

app.post('/api/tickets/book', function(req, res) {
    const { inbound, outbound, from_date, price, seat } = req.body;
    Ticket.findOneAndUpdate({inbound: inbound, outbound: outbound, from_date: from_date, price: price, seat: seat }, {booked: true})
    .then((ticket) => { 
      io.sockets.emit('ticket-booked', [ ticket._id ])
      return res.status(200).json(ticket)
    })
});

app.post('/api/tickets/bookReturn',async function(req, res) {
  const { singleId, returnId } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  let updated = true
  await Ticket.findById(singleId,  (err, doc) => {
    if (!doc.booked){
      doc.booked = true
      doc.type_id = returnId
      doc.save(err => {
        if (err){
          console.log(err)
          session.abortTransaction()
          return res.sendStatus(500)
      }
      })
    } else {
      updated = false
    }
  })
  await Ticket.findById(returnId, (err, doc) => {
    if (!doc.booked){
      doc.booked = true
      doc.type_id = singleId
      doc.type = 'return'
      doc.save(err => {
        if (err){
          console.log(err)
          session.abortTransaction()
          updated = false
      }
      })
    } else {
          session.abortTransaction()
          updated = false
    }
    
  })

  if (updated){
    await session.commitTransaction()

    session.endSession();
    io.sockets.emit('ticket-booked', [ singleId, returnId ])
    return res.sendStatus(200)
  }
  else{
    session.endSession();
    return res.sendStatus(500)
  }
});

app.post('/api/tickets/search', withAuth, function(req, res) {
  let seats = req.body.seats
    const { inbound, outbound, from_date, to_date } = req.body;
    let query = {inbound: inbound, outbound: outbound, from_date: {$gte:from_date, $lt: to_date} }
    if (req.type == 'user'){
      query.booked = false
    }
    Ticket.find(query)
    .then((tickets) => {
      return res.status(200).json(tickets)
    })

});

server.listen(process.env.PORT || 8080);
