/*********************************************************************************
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Octavio Luzardo Student ID: 148422181 Date: January 16th, 2020
* Heroku Link: _______________________________________________________________
*
********************************************************************************/ 

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dataService = require("./modules/data-service.js");

const myData = dataService("mongodb+srv://oluzardo:testtest121@web422a1-xyldc.mongodb.net/sample_supplies?retryWrites=true&w=majority");

const app = express();

app.use(cors());

app.use(bodyParser.json());

const HTTP_PORT = process.env.PORT || 8080;

// ************* API Routes

// POST /api/sales (NOTE: This route must read the contents of the request body)
app.post("/api/sales", (req, res) => {
    myData
        .addNewSale(req.body)
        .then(()=>
            res.status(201).json(`New sale added ${req.body.myData}`)
        )
        .catch(()=>
            res.status(404).json({ message: "Resource not found" })
        )
  });


// GET /api/sales (NOTE: This route must accept the numeric query parameters "page" and "perPage", ie: /api/sales?page=1&perPage=5 )
app.get("/api/sales", (req, res) => {
    myData
        .getAllSales(req.query.page, req.query.perPage)
        .then((data) =>
            res.status(200).json({data})
        )
        .catch(()=>
            res.status(404).end()
        )
  });


// GET /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8)
app.get("/api/sales/:id", (req, res) => {
    myData
        .getSaleById(req.params.id)
        .then((data) =>
            res.status(200).json({data})
        )
        .catch(()=>
            res.status(404).end()
        )
  });


// PUT /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8 as well as read the contents of the request body)
app.put("/api/sales/:id", (req, res) => {
    if (req.params.id != req.body._id){
        res.status(404).json({ "message": "Resource not found" });
        console.log("not passed");
    }
    else{
        myData
            .updateSaleById(req.body, req.body._id)
            .then(()=>
                res.status(200).json({message: "Successful update"})
            )
            .catch(()=>{
                res.status(404).json({message: "Resource not found" })
                console.log("passed")}
            )
    }
  });


// DELETE /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8)
app.delete("/api/sales/:id", (req, res) => {
    myData.deleteSaleById(req.params.id);
    res.status(204).end();
  });

// ************* Initialize the Service & Start the Server

myData.initialize().then(()=>{
    app.listen(HTTP_PORT,()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});

