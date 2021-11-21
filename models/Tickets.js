const mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);

const Ticket = new mongoose.Schema({
  inbound: { type: String, required: true },
  outbound: { type: String, required: true },
  seat: { type: Number },
  from_date: { type: Date, required: true },
  to_date: { type: Date, required: true },
  price: {type: Number, required: true},
  type: {type: String, default: 'single'},
  booked: {type: Boolean, default: false}
  });

  Ticket.index({ inbound: 1, outbound: 1, seat: 1, from_date: 1, to_date: 1 }, { unique: true });
  Ticket.plugin(AutoIncrement, {id:'seat',inc_field: 'seat', reference_fields: ['inbound','outbound', 'from_date', 'to_date']});

module.exports = mongoose.model('Ticket', Ticket);
