import * as React from "react";

const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);
  
  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);
  
  return [value, setValue];
}

const InputWithLabel = ({
  id,
  type = "text",
  value,
  onInputChange,
  isFocused = true,
  children,
}) => {
  const inputRef = React.useRef();

  React.useEffect(() =>{
    if (isFocused && inputRef.current){
      inputRef.current.focus();
    }
  },[isFocused]);

  return (
    <>
      <h1> My Hacker Stories </h1>
      <label htmlFor={id}> {children} </label>
      <input id={id} value={value} type={type} ref={inputRef} onChange={onInputChange} />
    </>
  );
};

const List = ({ list, onRemoveItem }) => {
  return (
    <ul>
      {list.map((book) => (
        <Item key={book.objectID} item={book} onRemoveItem={onRemoveItem}/>
      ))}
    </ul>
  );
};

const Item = ({ item, onRemoveItem }) => {

  const handleRemoveItem = () => {
    onRemoveItem(item);
  }

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
      <span><button type="button" onClick={handleRemoveItem}> Dismiss </button></span>
      <br />
    </li>
  );
};

const App = () => {
  const initialStories = [
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
  const [stories, setStories] = React.useState(initialStories);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveStories = (item) => {
    const newStories = stories.filter((story) => story.objectID !== item.objectId);
    setStories(newStories);
  }

  return (
    <div>
      <InputWithLabel id='search' value={searchTerm} onInputChange={handleSearch}><strong>Search : </strong></InputWithLabel>
      <List list={searchedStories} onRemoveItem={handleRemoveStories} />
    </div>
  );
};

export default App;
