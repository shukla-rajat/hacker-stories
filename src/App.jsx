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
      <br />
    </li>
  );
};

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";
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

  const storiesReducer = (state, action) => {
    switch(action.type){
      case 'STORIES_FETCH_INIT':
        return {
          ...state,
          isLoading: true,
          isError: false
        };
      case 'STORIES_FETCH_SUCCESS':
        return {
          ...state,
          isError : false,
          isLoading: false,
          data: action.payload
        };
      case 'STORIES_FETCH_FAILURE':
        return {
          ...state,
          isError: true,
          isLoading: false
        }
      case 'REMOVE_STORIES':
        return {
          ...state, 
          data: state.data.filter((story) => {
          return story.objectID !== action.payload.objectID;
          })
        }
      default:
        throw new Error();
    }
  }

  const [stories, dispatchStories] = React.useReducer(storiesReducer, { data:[], isError: false, isLoading: false });
  const [searchTerm, setSearchTerm] = useStorageState("search", "React");
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const handleFetchStories = React.useCallback(() => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.hits,
        });
      })
      .catch(() =>
        dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
      );
  }, [url]);

  React.useEffect(() => handleFetchStories(),[handleFetchStories]);

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  }

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
        onInputChange={handleSearchInput}
      >
        <strong>Search : </strong>
      </InputWithLabel>
      <button type='button' disabled={!searchTerm} onClick={handleSearchSubmit}> Submit </button>
      { stories.isError && <p> Something went wrong </p>}
      { stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStories} />
      )}
    </div>
  );
};

export default App;
