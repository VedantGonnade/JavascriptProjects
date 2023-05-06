import Joi from 'joi';
import express from 'express';
import jwt from 'jsonwebtoken'

const app = express();

// array initialization for the data storage
const usersData = [];

// express middleware to use json.
app.use(express.json());
let loginData = {};

app.post('/login', (req, res) => {

    const secretKeyForJWT = process.env.PRIVATE_KEY
    const payload = {
        username: req.body.username
    }
    // Schema building for input validation
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });

    // input is getting validated
    const result = schema.validate({
        username: req.body.username,
        password: req.body.password
    })

    if (result.error) {
        res.status(400).send("Bad Request");
        return;
    } else {
        // creating a JWT token
        const token = jwt.sign(payload, secretKeyForJWT, {expiresIn: '3600s'});
        const Z = res.set('auth_token', `Bearer ${token}`);
        res.status(200).send({message: "Sucessfully logged In"})
        return;
    }
});

// route to register a new user.
app.post("/register", (req, res) => {

    // Schema building for input validation
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required().min(5).max(20),
        name: Joi.string().required().min(3).max(10),
        college: Joi.string(),
        year_of_graduation: Joi.number()
    })

    // input is getting validated
    const result = schema.validate({
        username: req.body.username,
        password: req.body.password,
        name : req.body.name,
        college: req.body.college, 
        year_of_graduation: req.body.year_of_graduation
    })

    // Checking if username already exists?
    if (usersData.length > 0) {
        for (const user of usersData) {
            if (user.username === req.body.username) 
            {
                res.status(400).send("Username is already in use!!")
                return;
            }
        }
    }

    // making a new object for the current user
    const currentUserData = {
        "username": req.body.username,  // fill this value by taking from the request
        "password": req.body.password,
        "name": req.body.name,
        "college": req.body.college, 
        "year-of-graduation": req.body.year_of_graduation
      };
    
   // if the input valiation is incorrect, the response will be 404. 
   // If not the cuurent user will be pushed to the userData array and the status of 200 with a succesful message will be delivered.
    if (result.error) {
        res.status(400).send("Bad Request");
        return;
    }
    else{
        // push the data to the global array, so that it is visible (and can be used) by other APIs as well
          usersData.push(currentUserData);
          res.status(200).send({message: "Successfully registered!"});
          return;
    }
  

});

// route to list all users
app.get('/listUsers', (req, res) => {

    // if the length of userData array if null, no user is found.
    // if more than 0, users will be returned in a json array format.
    // otherwise, status 404 will be the response
    if (usersData.length > 0) {
        res.status(200).send(JSON.parse(JSON.stringify(usersData)));
        return;
    }
    else if (usersData.length === 0) {
        res.status(200).send({message: "no Users found"});
        return;
    }
    res.status(404).send({message: "Bad Request"});
    return;
    
})

// route to update the user information.
app.put('/updateUser', (req, res) => {

    const {authorization} = req.headers;
    const loginData = authorization.split(' ')[1].split('.')[1];  
    // extracting data from JWT
    const data = JSON.parse(Buffer.from(loginData, 'base64').toString());
    // schema for input validation
    const schema = Joi.object({
        name: Joi.string().min(3).max(10),
        college: Joi.string(),
        year_of_graduation: Joi.number()
    });

    // input is getting validated with respect to the schema.
    const result = schema.validate({
        name : req.body.name,
        college: req.body.college, 
        year_of_graduation: req.body.year_of_graduation
    });

    let validRequest = true;

    // checking if the input is valid and sending 404, if the input is invalid.
    if (result.error){
        validRequest = false;
        res.status(404).send({message:"Bad request"});
        return;
    }

    // if a valid request is received and userData length is greater than 0, user will be updated based on the input.
    if (validRequest = true && usersData.length > 0) {
        for (const user of usersData) {
            if (user.username === data.username) {
                if (req.body.name) user.name = req.body.name;
                if (req.body.college) user.college = req.body.college;
                if (req.body.year_of_graduation) user.year_of_graduation = req.body.year_of_graduation;
                res.status(200).send(`Item with username: ${user.username} is updated successfully!!`);
                return;
            }
        }
    }
    else {
        res.status(200).send({message: "No User found to update"});
        return;
    }
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})