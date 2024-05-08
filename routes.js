const express = require("express");
const router = express.Router();
const initializePayment = require("./controllers");

router.post("/accept-payment", initializePayment.acceptPayment);
router.get("/verify-payment", initializePayment.verifyTransaction);
router.post("/create-customer", initializePayment.createCustomer)

module.exports = router;