import { useState, useEffect } from 'react'
import axios from 'axios'
import api from './services/api'
import './index.css'

const Notification = ({ type, message }) => {

  if (type === null) {
    return null
  }
  if (type === "added") {
    return (
      <div className="added">
       {message}
      </div>
    )
  }
  if (type === "error") {
    return (
      <div className="error">
       {message}
      </div>
    )
  }
}
const Person = ({ removePerson, id, name, number }) => {
  console.log(removePerson)
  return (
    <div>
       {name} {number}
       <button type="submit" onClick={()=> removePerson(id)}>Delete</button>
    </div>
  )
}

const Filter = ({ value, onChange}) => {
  return (
    <div>
      filter shown with <input value={value} onChange={onChange} />
    </div>
  )
}

const Input = ({ value, onChange }) => {
  return (
      <input value={value} onChange={onChange} /> 
  )
}

const Form = ({ onSubmit, value, onChange }) => {
  console.log(value[1])
  console.log(onChange)
  return (
    <form onSubmit={onSubmit}>
        <div>name: <Input value={value[0]} onChange={onChange[0]} /></div>
        <div>number: <Input value={value[1]} onChange={onChange[1]} /></div>
        <div><button type="submit">add</button></div>
    </form>
  )
}

const FilteredPersons = ({ removePerson, filteredaraay }) => {
  return (
    <>
      {filteredaraay.map((person) => (
        <Person key={person.name} removePerson={removePerson} id={person.id} name={person.name} number={person.number} />
      )
      )}
    </>
  )
}


const App = () => { 

  const [persons, setPersons] = useState([{name: "none"}])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [actionMessage, setActionMessage] = useState({
    type: 'null',
    message: 'null'
  })

  useEffect(() => {
    console.log('effect')
    api.getAll()
    .then(persons => {
      setPersons(persons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    console.log('Button clicked', newName)
    // check if already in phonebook 
    let check = false
    persons.map((person) => {
      console.log(person.name, newName)
      if (person.name === newName) {
        confirm(`${newName} is already added to phonebook, are you sure you want to update number`)
        console.log('setting action message')
        api.update({name: newName, number: newNumber}, person.id)
        .then(updatedPerson => {
          console.log(person.id)
          console.log(updatedPerson)
          setPersons(persons.map(person => person.id !== updatedPerson.id ? person : updatedPerson))
          setActionMessage({
            type: 'added',
            message:`${newName} sucesfully added to the phonebook`
          })
        })
        .catch (error => {
          console.log(error)
          setActionMessage({
            type: 'error',
            message:`the person ${newName} was unable to be updated `
          })
          alert(`the person ${newName} was unable to be updated `)
        })
        setTimeout(() => {
          setActionMessage({
            type: null,
            message: null
          })
        }, 5000)
        setNewName("")
        setNewNumber("")
        check = true
        return
      }
    })
    //leave function if already in phonebook
    if (check) {
      return
    }
   
    api.create({name: newName, number: newNumber})
    .then(person => {
      const newPerson = persons.concat(person)
      setPersons(newPerson)
    })
    .catch(error => {
      alert(`${newName} was unable to be added to the phonebook`)
    })
    setNewNumber("")
    setNewName("")
  }

  const removePerson = (id) => {
    console.log(id)
    const message = "are you sure you want to delete this entry"
    confirm(message)
    api.remove(id)
    .then(person => {
      console.log(person)
      const removedPersons = persons.filter(person => person.id !== id)
      console.log(removedPersons)
      setPersons(removedPersons)
    })
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleNewSearch = (event) => {
    setNewSearch(event.target.value)
  }

  console.log(newSearch)
  console.log(persons)
  let search = newSearch.toLowerCase()
  const filteredaraay = persons.filter((person) => person.name.toLowerCase().startsWith(search))
  console.log(filteredaraay)

  console.log(persons)
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification type={actionMessage.type} message={actionMessage.message}/>
      <Filter value={newSearch} onChange={handleNewSearch}/>
      <h3>Add a new</h3>
      <Form onSubmit={addPerson} value={[newName,newNumber]} onChange={[handleNameChange, handleNumberChange]}/>
      <h2>Numbers</h2>
      <FilteredPersons removePerson ={removePerson}filteredaraay={filteredaraay}/>
    </div>
  )
}

export default App
