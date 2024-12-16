import * as React from "react";

const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);
  
  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);
  
  return [value, setValue];
}

const InputWithLabel = ({ id, type ='text', value, onInputChange, children }) => {
  return (
    <>
      <h1> My Hacker Stories </h1>
      <label htmlFor={id}> {children} </label>
      <input id={id} value={value} type={type} onChange={onInputChange} />
    </>
  );
};

const List = ({ list }) => {
  return (
    <ul>
      {list.map((book) => (
        <Item key={book.objectID} item={book} />
      ))}
    </ul>
  );
};

const Item = ({ item }) => {
  return (
    <li>
      <span>Title: {item.title}</span>
      <br />
      <span>URL: {item.url}</span>
      <br />
      <span>Author: {item.author}</span>
      <br />
      <span>Points: {item.points}</span>
      <br />
    </li>
  );
};

const App = () => {
  const stories = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: "Redux",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const [searchTerm, setSearchTerm] = useStorageState('search','React');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <InputWithLabel id='search' value={searchTerm} onInputChange={handleSearch}><strong>Search : </strong></InputWithLabel>
      <List list={searchedStories} />
    </div>
  );
};

export default App;
