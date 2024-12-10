import * as React from "react";

const Search = ({ search, onSearch }) => {
  return (
    <div>
      <h1> My Hacker Stories </h1>
      <label htmlFor="Search"> Search : </label>
      <input id="search" value={search} type="text" onChange={onSearch} />
    </div>
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

const useStorageState = (initialState) => {
  const [value, setValue] = React.useState(localStorage.getItem("value") || initialState);
  
  React.useEffect(() => {
    localStorage.setItem("value", value);
  }, [value]);
  
  return [value, setValue];
}

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

  const [searchTerm, setSearchTerm] = useStorageState("React");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Search search={searchTerm} onSearch={handleSearch} />
      <List list={searchedStories} />
    </div>
  );
};

export default App;
