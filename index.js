require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const shortid = require("shortid")
const Razorpay = require("razorpay")
// API

// App Config
const app = express()

const razorpay = new Razorpay({
	key_id: "rzp_test_jsTm2eAq8BUZKf",
	key_secret: "RjkUnbPfrW1poiMJo7AkT5oR",
})

// Middlewares
app.use(bodyParser.json())
app.use(cors())
app.use(express.json())

// API routes
app.get("/", (req, res) => res.status(200).send("Hello World"))

app.post("/razorpay/create", async (req, res) => {
	console.log("hii from /razorpay/create")
	try {
		const response = await razorpay.orders.create({
			amount: req.query.total,
			currency: "INR",
			receipt: shortid.generate(),
			payment_capture: 1,
		})

		res.json(response)
	} catch (error) {
		console.log("/razorpay/create")
		console.log(error)
	}
})

app.post("/verification", (req, res) => {
	try {
		const secret = "123456789"

		const crypto = require("crypto")

		const shasum = crypto.createHmac("sha256", secret)
		shasum.update(JSON.stringify(req.body))
		const digest = shasum.digest("hex")

		if (digest === req.headers["x-razorpay-signature"]) {
			console.log("Request is legit")
		} else {
		}
		res.json({ status: "ok" })
	} catch (error) {
		console.log("/verification")
		console.log(error)
	}
})

app.get("/payment/:id", async (req, res) => {
	try {
		const payment_id = req.params.id
		const payment = await razorpay.payments.fetch(payment_id)
		res.json(payment)
	} catch (error) {
		console.log("/payment/:id")
		console.log(error)
	}
})

// Listen command
app.listen(process.env.PORT || 1337, console.log("Server connected"))
