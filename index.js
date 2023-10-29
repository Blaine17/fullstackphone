require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('backend'))
app.use(cors())




morgan.token('body', function (req) {

  return `${JSON.stringify(req.body)}` })

app.use(morgan(':method :url :status :response-time :req[header] :body'))

const errorhandler = (error, request, response, next) => {
  console.error('This is the message:', error.message)


  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// app.get('/', (request, response) => {
//   response.send('<h1>Hello World!</h1>')
// })

app.get('/info', (request, response, next) => {
  const timestamp = new Date()
  console.log(new Date())
  Person.find({})
    .then(persons => {
      response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${timestamp}</p>`)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  // const person = persons.find(person => person.id === id)
  console.log(id)
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {

  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  console.log(request.params)
  Person.findByIdAndUpdate(request.params.id,
    { number: request.body.number },
    { new: true, runValidators: true, contect: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log(request.body)

  if (!body.name || !body.number) {
    const message = `${!body.name ?'name' : 'number'} is missing`
    console.log(message)
    return response.status(400).json({
      error: message
    })
  }

  Person.find({ name: body.name })
    .then(persons => {
      console.log(persons.length)
      if (persons.length) {
        console.log('line 100', persons)
        return response.status(400).json({
          error: `${persons.name} already in phonebook`
        })
      }
      const person = new Person({
        name: body.name,
        number: body.number,
      })
      person.save()
        .then(savedPerson => {
          console.log('saved to DB')
          response.json(savedPerson)
        })
        .catch(error => next(error))
    })
})

// app.listen(5001, () => {
//     console.log("Running on port 5001.");
//   });

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use(unknownEndpoint)
app.use(errorhandler)
module.exports = app

// const PORT = 3001
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })