const express = require('express')
const app = express()
require('dotenv').config()
const morgan = require('morgan')
const cors =require('cors')
const Person = require('./Person')
const PORT =process.env.PORT || 3001

app.use(express.json())
app.use(cors())
morgan.token('body', req => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


app.get('/api/persons',(req,res) => {
  Person.find({}).then(result => {
    res.json(result)
  })
})
app.get('/api/info',(req,res,next) => {
  const date = new Date()
  Person.find({}).then(result => {
    res.send(`
        <p>Phonebook has info for ${result.length} people</p>
        <p>${date}</p>
            `)
  }).catch(err => next(err))

})
app.get('/api/persons/:id',(req,res,next) => {
  Person.findById(req.params.id).then((person) => {
    if(person){
      res.json(person)
    }else{
      res.status(404).end()
    }
  }).catch(err => next(err))
})
app.put('/api/persons/:id', (req,res,next) => {
  const body=req.body
  const person={
    name:body.name,
    number:body.number
  }
  Person.findByIdAndUpdate(req.params.id, person,{ new: true, runValidators: true, context: 'query' })
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((err) => next(err))
})
app.delete('/api/persons/:id',(req,res,next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(res.status(204).end())
    .catch(err => next(err))
})
app.post('/api/persons',(req,res,next) => {
  const body = req.body

  const newPerson=new Person({
    name :body.name,
    number:body.number
  })
  newPerson.save().then((result) => {
    res.json(result)
  }).catch(error => next(error))

})

app.use(unknownEndpoint)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})