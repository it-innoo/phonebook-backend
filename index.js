
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

morgan
  .token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  Person
    .find()
    .then((persons) => {
      response
        .send(
          `<p>
        Puhelinluettelossa
        ${persons.length} henkilön tiedot
        </p>
        <p>
          ${new Date()}
        </p>`,
        )
    })
})

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then((persons) => {
      response.json(persons.map(p => p.toJSON()))
    })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const name = names.find(p => p.id === id)

  name ? response.json(name) : response.status(404).end()
})

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body

  const person = new Person({
    name, number
  })

  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson.toJSON())
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
  // console.error(response)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})