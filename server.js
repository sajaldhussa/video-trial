const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 5000
const UserRoutes = require('./routes/users')
const VerificationRoutes = require('./routes/verification')

app.use(express.static(__dirname + "/public"))
app.use('/users', UserRoutes)
app.use('/verification', VerificationRoutes)

http.listen(port, () => console.log(`Active on ${port} port`))



