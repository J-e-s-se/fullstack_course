import { useState, useEffect } from "react";
import personsService from "./services/persons";

const Persons = ({ persons, performSearchFilter, deletePerson }) => {
  return (
    <>
      {persons.filter(performSearchFilter).map((person) => (
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={() => deletePerson(person)}>delete</button>
        </p>
      ))}
    </>
  );
};

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
        name:
        <input value={newName} onChange={handleNameChange} />
      </div>

      <div>
        number:
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
      filter shown with
      <input value={search} onChange={handleSearchChange} />
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const nameIsUsed = persons.some((person) => person.name === newName);
    nameIsUsed && alert(`${newName} is already added to phonebook`);
    const newPersonObj = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    };

    personsService.create(newPersonObj).then((returnedPerson) => {
      setPersons((oldPersons) => oldPersons.concat(returnedPerson));
    });

    setNewName("");
    setNewNumber("");
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
