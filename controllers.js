require("dotenv").config();
const https = require("https");

const payStack = {
  acceptPayment: async (req, res) => {
    console.log(req.body);
    try {
      const email = req.body.email;
      // const amount = req.body.amount;
      const params = JSON.stringify({
        email: email,
        amount: 100 * 100,
        // callback_url: "https://www.isnmedical.com",
      });
      const options = {
        hostname: "api.paystack.co",
        port: 443,
        path: "/transaction/initialize",
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      };
      const clientReq = https
        .request(options, (apiRes) => {
          let data = "";
          apiRes.on("data", (chunk) => {
            data += chunk;
          });
          apiRes.on("end", () => {
            try {
              const responseData = JSON.parse(data);
              // res.status(200).json(responseData);
              console.log(responseData);
              console.log(responseData.data.authorization_url);
              res.redirect(responseData.data.authorization_url);
            } catch (error) {
              res.status(500).json({ error: error.message });
            }
          });
        })
        .on("error", (error) => {
          res.status(500).json({ error: error.message });
        });
      clientReq.write(params);
      clientReq.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  createCustomer: async (req, res) => {
    try {
      const { email, firstName, lastName, phone } = req.body;
      const params = JSON.stringify({
        email: email,
        first_name: firstName,
        last_name: lastName,
        phone: phone,
      });
      const options = {
        hostname: "api.paystack.co",
        port: 443,
        path: "/customer",
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      };
      const clientReq = https
        .request(options, (apiRes) => {
          let data = "";
          apiRes.on("data", (chunk) => {
            data += chunk;
          });
          apiRes.on("end", () => {
            try {
              const responseData = JSON.parse(data);
              res.status(200).json(responseData);
            } catch (error) {
              res.status(500).json({ error: error.message });
            }
          });
        })
        .on("error", (error) => {
          res.status(500).json({ error: error.message });
        });
      clientReq.write(params);
      clientReq.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  verifyTransaction: async (req, res) => {
    try {
      const reference = req.query.reference;
      const options = {
        hostname: "api.paystack.co",
        port: 443,
        path: `/transaction/verify/${reference}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.SECRET_KEY}`,
        },
      };

      const verifyReq = https.request(options, (verifyRes) => {
        let data = "";

        verifyRes.on("data", (chunk) => {
          data += chunk;
        });

        verifyRes.on("end", () => {
          try {
            const responseData = JSON.parse(data);
            res.status(200).json(responseData);
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
        });
      });

      verifyReq.on("error", (error) => {
        res.status(500).json({ error: error.message });
      });

      verifyReq.end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

const initializePayment = payStack;
module.exports = initializePayment;
