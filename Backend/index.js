const connectToMongo = require("./db");
const express = require('express')

connectToMongo();

const app = express()

var cors = require('cors')
app.use(cors())

const port = 5000;
// respond with "hello world" when a GET request is made to the homepage
// app.get('/', (req, res) => {
//   res.send('Hare Krishna')
// })

app.use(express.json());
//Available routes.
app.use('/api/auth',require('./routes/auth.js'));
app.use('/api/notes',require('./routes/notes.js'));


app.listen(port,()=>{
    console.log(`iNotebook backend is listening to http://localhost:${port}`);
})