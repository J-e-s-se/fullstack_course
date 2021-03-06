import { useState, useEffect } from "react";
import personsService from "./services/persons";

const Persons = ({ persons, performSearchFilter, deletePerson }) => {
  return (
    <>
      {persons.filter(performSearchFilter).map((person) => (
        <p key={person.id}>
          {person.name} {person.number}{" "}
          <button onClick={() => deletePerson(person)}>delete</button>
        </p>
      ))}
    </>
  );
};

const Notification = ({notification}) => {
  if (notification.message === null) {
    return null
  }

  return (
    <div className={notification.classname}>
      {notification.message}
    </div>
  )
}

const PersonForm = (props) => {
  const {
    newName,
    newNumber,
    handleNameChange,
    handleNumberChange,
    addPerson,
  } = props;
  return (
    <form onSubmit={addPerson}>
      <div>
        name:{" "}
        <input value={newName} onChange={handleNameChange} />
      </div>

      <div>
        number:{" "}
        <input value={newNumber} onChange={handleNumberChange} />
      </div>

      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Filter = ({ search, handleSearchChange }) => {
  return (
    <div>
      filter shown with{" "}
      <input value={search} onChange={handleSearchChange} />
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState({message: null, classname: null})

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const nameIsUsed = persons.some((person) => person.name === newName);
    nameIsUsed && alert(`${newName} is already added to phonebook, replace the old number with a new one?`);

    let newPerson;
    let promise;

    if (nameIsUsed) {
      const prevPerson = persons.find(p => p.name === newName)
      newPerson = {...prevPerson, "number" : newNumber}
      promise = personsService.update(newPerson.id, newPerson)
    }

    else {
      newPerson = {
        name: newName,
        number: newNumber,
        id: persons.length + 1
      }
      promise = personsService.create(newPerson)
    }
    
    promise
      .then(returnedPerson => {
        setPersons(oldPersons => {
          return nameIsUsed ?
          (oldPersons.filter(p => p.id !== returnedPerson.id).concat(returnedPerson))
          :
          (oldPersons.concat(returnedPerson))
        })
        setNotification({message: `Added ${returnedPerson.name}`, classname: "success"})
        setTimeout(() => {
          setNotification({message: null, classname: null})
        }, 5000)
        setNewName("")
        setNewNumber("")
      })
      .catch((error) => {
        setNotification({message: `Information of ${newPerson.name} has already been removed from the server`, classname: "error"})
        setTimeout(() => {
          setNotification({message: null, classname: null})
        }, 5000)
      })
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const performSearchFilter = (person) => {
    return person.name.toLowerCase().includes(search.toLowerCase());
  };

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personsService
      .remove(person.id)
      .then(
        setPersons(oldPersons => oldPersons.filter(p => p.id !== person.id))
      )
    }
  };

  useEffect(() => {
    personsService.list().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} handleSearchChange={handleSearchChange} />
      <h3>add a new</h3>
      <Notification notification={notification} />
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />

      <h2>Numbers</h2>
      <Persons
        persons={persons}
        performSearchFilter={performSearchFilter}
        deletePerson={deletePerson}
      />
    </div>
  );
};

export default App;
