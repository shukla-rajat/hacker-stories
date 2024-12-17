import * as React from "react";

const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const InputWithLabel = ({
  id,
  type = "text",
  value,
  onInputChange,
  isFocused = true,
  children,
}) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <h1> My Hacker Stories </h1>
      <label htmlFor={id}> {children} </label>
      <input
        id={id}
        value={value}
        type={type}
        ref={inputRef}
        onChange={onInputChange}
      />
    </>
  );
};

const List = ({ list, onRemoveItem }) => {
  return (
    <ul>
      {list.map((book) => (
        <Item key={book.objectID} item={book} onRemoveItem={onRemoveItem} />
      ))}
    </ul>
  );
};

const Item = ({ item, onRemoveItem }) => {
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
      <span>
        <button type="button" onClick={() => onRemoveItem(item)}>
          {" "}
          Dismiss{" "}
        </button>
      </span>
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

  const getAsyncStories = new Promise((resolve) => {
    setTimeout(() => resolve({ data: { stories: initialStories } }), 2000);
  });

  const storiesReducer = (state, action) => {
    switch(action.type){
      case 'SET_STORIES':
        return action.payload;
      case 'REMOVE_STORIES':
        return stories.filter((story) => {
          return story.objectID !== action.payload.objectID;
        })
      default:
        throw new Error();
    }
  }

  const [stories, dispatchStories] = React.useReducer(storiesReducer, []);
  const [searchTerm, setSearchTerm] = useStorageState("search", "React");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  
  React.useEffect(() => {
    setIsLoading(true);
    getAsyncStories
      .then((result) => {
        setIsLoading(false);
        dispatchStories({
          type: 'SET_STORIES',
          payload: result.data.stories
        });
      })
      .catch(() => setIsError(true));
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveStories = (item) => {
    dispatchStories({
      type: 'REMOVE_STORIES',
      payload: item
    });
  };

  return (
    <div>
      <InputWithLabel
        id="search"
        value={searchTerm}
        onInputChange={handleSearch}
      >
        <strong>Search : </strong>
      </InputWithLabel>
      { isError && <p> Something went wrong </p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={searchedStories} onRemoveItem={handleRemoveStories} />
      )}
    </div>
  );
};

export default App;
