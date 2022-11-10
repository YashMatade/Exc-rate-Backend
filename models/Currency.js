var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var schema = new Schema({
    currency: { type: String, required: true },
    price: { type: Number, required: true }
});
var Currency = mongoose.model("currencies", schema);
module.exports = Currency;