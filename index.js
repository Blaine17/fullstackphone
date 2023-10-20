const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())


morgan.token('body', function (req, res) { 

    return `${JSON.stringify(req.body)}` })

app.use(morgan(':method :url :status :response-time :req[header] :body'))


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

console.log(Math.random() * 5000)
  

// app.get('/', (request, response) => {
//   response.send('<h1>Hello World!</h1>')
// })

app.get('/info', (request, response) => {
    const entries = persons.length
    const timestamp = new Date()
    console.log(new Date())
    response.send(`<p>Phonebook has info for ${entries} people</p> <p>${timestamp}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(request.body)
    console.log(request.headers)

    if (!body.name || !body.number) {
        const message = `${!body.name ? "name" : "number"} is missing`
        console.log(message)
        return response.status(400).json({
            error: message
        })
    }
    
    const duplicate = persons.find(person => person.name === body.name)
    
    if (duplicate) {
        return response.status(400).json({
            error: `${duplicate.name} already in phonebook`
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.random() * 5000
    }

    persons = persons.concat(person)

    response.json(person)

})

app.listen(5001, () => {
    console.log("Running on port 5001.");
  });

module.exports = app

// const PORT = 3001
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })