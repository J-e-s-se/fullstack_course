import { useState } from "react";

const Persons = ({ persons, performSearchFilter }) => {
  return (
    <>
      {persons.filter(performSearchFilter).map((person) => (
        <p key={person.id}>
          {person.name} {person.number}
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
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);

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
    setPersons((oldPersons) => oldPersons.concat(newPersonObj));
    setNewName("");
    setNewNumber("");
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const performSearchFilter = (person) => {
    return person.name.toLowerCase().includes(search.toLowerCase());
  };

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
      />

    </div>
  );
};

export default App;
