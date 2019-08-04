
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


let names = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

const generateId = () => {
  const minId = Math.ceil(names.length > 0
    ? Math.max(...names.map(p => p.id))
    : 0)
  const maxId = Math.floor(1000000)
  return Math.floor(Math.random() * (maxId - minId)) + minId
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
  const person = request.body

  if (!person.name) {
    return response.status(400).json({
      error: 'name is missing'
    })
  }

  if (!person.number) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }

  if (names.find(p => p.name === person.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  person.id = generateId()

  names = names.concat(person)
  response.json(person)
})

app.delete('/api/names/:id', (request, response) => {
  const id = Number(request.params.id)
  names = names.filter(p => p.id !== id)

  response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})