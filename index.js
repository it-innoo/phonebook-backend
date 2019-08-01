const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(bodyParser.json())
morgan
  .token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
  {
    "person": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "person": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "person": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "person": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

const generateId = () => {
  const minId = Math.ceil(persons.length > 0
    ? Math.max(...persons.map(p => p.id))
    : 0)
  const maxId = Math.floor(1000000)
  return Math.floor(Math.random() * (maxId - minId)) + minId
}

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  response.send(
    `
    <p>Puhelinluettelossa
        ${persons.length} henkilön tiedot
    </p>
    <p>
      ${new Date()}
    </p>
    `
  )
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)

  person ? response.json(person) : response.status(404).end()
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

  if (persons.find(p => p.name === person.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  person.id = generateId()

  persons = persons.concat(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})