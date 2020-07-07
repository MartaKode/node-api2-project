const express = require('express')
const cors = require('cors')//~~~~~~import for Stretch~?

const server = express()

server.use(express.json())
server.use(cors()) // ~~~~~~Stretch~?

//postsRouter
const postsRouter = require('./posts/posts-router.js')

server.get('/', (req,res) => {
    res.send(`
    <h2> node-api2-project </h2>
    <p>Up and running! </p>
    `)
})

//server.use routes
server.use('/api/posts', postsRouter)

const port = 8000
server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})