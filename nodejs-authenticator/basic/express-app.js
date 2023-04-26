import Joi from 'joi';
import express from 'express';

const app = express();

// GET /me/hello?name=<YOUR_NAME> -> Hello <YOUR_NAME>
app.get('/me/hello', (req, res) => {
    const name = req.query.name;
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required()
    })
    const result = schema.validate({name});
    if(result.error) {
        res.status(400).send(result.error.details[0].message);
    }
    res.status(200).send(`Hello ${name}`);
})

// GET /me/hello/<YOUR_NAME> -> Hello <YOUR_NAME>
app.get('/me/hello/:name', (req, res) => {
    const name = req.params.name;
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required()
    });
    const result = schema.validate({name});
    if(result.error) {
        res.status(400).send(result.error.details[0].message);
    }
    res.status(200).send(`Hello ${name}`);
})

// GET /hello -> hello World from 'GET'
app.get('/hello', (req, res) => {
    res.status(200).send(`hello world from 'GET'`);   
})

// POST /hello -> hello World from 'POST'
app.post('/hello', (req, res) => {
    res.status(200).send(`hello world from 'POST'`);  
})

//GET /me?name=<YOUR_NAME> -> <YOUR_NAME>
app.get('/me', (req, res) => {
    const name = req.query.name;
    const schema = Joi.object({
        name : Joi.string().min(3).max(30).required()
    })
    const result = schema.validate({name});
    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    res.status(200).send(name);
})

// GET /me/<YOUR_NAME> -> </YOUR_NAME>
app.get('/me/:name', (req, res) => {
    const name = req.params.name;
    const schema = Joi.object({
        name : Joi.string().min(3).max(30).required()
    })
    const result = schema.validate({name});
    if(result.error) {
        res.status(400).send(result.error.details[0].message);
    }
    res.status(200).send(name);
})



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})