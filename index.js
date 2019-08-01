const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

let persons = [
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
  const name = persons.find(p => p.id === id)

  name ? response.json(name) : response.status(404).end()
})

app.post('/api/persons', (request, response) => {
  const name = request.body
  name.id = generateId()

  persons = persons.concat(name)
  response.json(name)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})