var express = require("express");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
let axios = require('axios');
let Currency = require("./models/Currency");

var app = express();
app.use(express.json());
app.use(bodyparser.json({ limit: "50mb" }));
app.use(bodyparser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static("public"));

const url = "mongodb+srv://exchangecurrency:n4WBoKol3DsdBLWL@cluster0.1oeacej.mongodb.net/exchangedatabase?retryWrites=true&w=majority";
mongoose.connect(url);
var db = mongoose.connection;
db.on("error", (err) => { console.log(err); });
db.on("open", () => { console.log("connection success"); });


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    if (req.method == "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE");
        return res.status(200).json({});
    }
    next();
});

app.get("/", (req, res) => {
    res.end("Welcome to Currency Exchange Web App");
});

app.get("/sync", (req, res) => {
    const config = {
        headers: {
            apikey: 'kG4e8ZwYhHdw63PW7FDpB9hiaLXRkH7o'
        }
    };
    Currency.deleteMany({}, () => {
        let currencies = "EUR,INR,CAD,GBP,JPY";
        axios.get('https://api.apilayer.com/currency_data/live?source=USD&currencies=' + currencies, config)
            .then(response => {
                let quotes = response.data.quotes;
                let array = currencies.split(",");
                console.log(array);
                array.forEach((c) => {
                    let currency = new Currency({
                        currency: c,
                        price: quotes['USD' + c]
                    });
                    currency.save();
                });
                res.end(JSON.stringify({ status: "success", data: response.quotes }));
            })
            .catch(error => {
                res.end(JSON.stringify({ status: "failed", error: error }));
            });
    });
});

app.use("/user", require("./routes/user"));
let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server is running at http://localhost:8081");
});
