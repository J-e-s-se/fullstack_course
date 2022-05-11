import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-834398'}
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const addPerson = (event) => {
    event.preventDefault()
    const nameIsUsed = persons.some(person => person.name === newName)
    nameIsUsed && alert(`${newName} is already added to phonebook`)
    const newPersonObj = {
      name: newName,
      number: newNumber,
    }
    setPersons(oldPersons => oldPersons.concat(newPersonObj))
    setNewName('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      
      <form onSubmit={addPerson}>

        <div>
          name: 
          <input 
            value={newName}
            onChange={handleNameChange}
          />
        </div>

        <div>
          number: 
          <input 
            value={newNumber}
            onChange={handleNumberChange}
          />
        </div>

        <div>
          <button type="submit">add</button>
        </div>

      </form>
      <h2>Numbers</h2>
      {persons.map(person => <p key={person.name}>{person.name} {person.number}</p>)}
    </div>
  )
}

export default App