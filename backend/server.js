const express = require('express')
const cookieParser = require('cookie-parser')
const productService = require('./services/product.service.js')
const authService = require('./services/auth.service.js')
const cors = require('cors')
const app = express()

// App configuration
app.use(express.static('public'))

const corsOptions = {
    origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000'],
    credentials: true
}
app.use(cors(corsOptions))


app.use(cookieParser())
app.use(express.json())


// Real routing express
// List
app.get('/api/product', (req, res) => {
    const filterBy = req.query
    productService.query(filterBy)
        .then((products) => {
            res.send(products)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get products')
        })
})

// Update
app.put('/api/product', (req, res) => {
    // const loggedinAdmin = authService.validateToken(req.cookies.loginToken)
    // if (!loggedinAdmin) return res.status(401).send('Cannot update product')

    const product = req.body
    productService.save(product)
        .then((savedProduct) => {
            res.send(savedProduct)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot update product')
        })
})

// Create
app.post('/api/product', (req, res) => {
    // const loggedinAdmin = authService.validateToken(req.cookies.loginToken)
    // if (!loggedinAdmin) return res.status(401).send('Cannot add product')

    const product = req.body
    productService.save(product)
        .then((savedProduct) => {
            res.send(savedProduct)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot create product')
        })
})

// Read - GetById
app.get('/api/product/:productId', (req, res) => {
    const { productId } = req.params
    productService.get(productId)
        .then((product) => {
            res.send(product)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get product')
        })
})

// Remove
app.delete('/api/product/:productId', (req, res) => {
    // const loggedinAdmin = authService.validateToken(req.cookies.loginToken)
    // if (!loggedinAdmin) return res.status(401).send('Cannot update product')

    const { productId } = req.params
    productService.remove(productId)
        .then(() => {
            res.send({ msg: 'product removed successfully', productId })
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot delete product')
        })
})


// Admin API:
// // List
app.get('/api/admin', (req, res) => {
    const filterBy = req.query
    authService.query(filterBy)
        .then((admins) => {
            res.send(admins)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get admins')
        })
})

app.get('/api/admin/:adminId', (req, res) => {
    const { adminId } = req.params
    authService.get(adminId)
        .then((admin) => {
            res.send(admin)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get admin')
        })
})


app.post('/api/admin/login', (req, res) => {
  
    const { adminname, password } = req.body

    authService.login(adminname, password)
        .then((admin) => {
            const loginToken = authService.getLoginToken(admin)
            res.cookie('loginToken', loginToken)
            res.send(admin)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot login')
        })
})

// app.post('/api/admin/signup', (req, res) => {
//     const { fullname, adminname, password, score } = req.body
//     authService.signup({ fullname, adminname, password, score })
//         .then((admin) => {
//             const loginToken = authService.getLoginToken(admin)
//             res.cookie('loginToken', loginToken)
//             res.send(admin)
//         })
//         .catch(err => {
//             console.log('Error:', err)
//             res.status(400).send('Cannot signup')
//         })
// })

app.post('/api/admin/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Logged out')
})

// Listen will always be the last line in our server!
const port = 3031
app.listen(port, () => console.log(`Server listening on port ${port}!`))



