import * as React from "react";
import axios from "axios";
import { sortBy } from 'lodash';

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState("search", "React");

  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const storiesReducer = (state, action) => {
    switch (action.type) {
      case "STORIES_FETCH_INIT":
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      case "STORIES_FETCH_SUCCESS":
        return {
          ...state,
          isError: false,
          isLoading: false,
          data: action.payload,
        };
      case "STORIES_FETCH_FAILURE":
        return {
          ...state,
          isError: true,
          isLoading: false,
        };
      case "REMOVE_STORIES":
        return {
          ...state,
          data: state.data.filter((story) => {
            return story.objectID !== action.payload.objectID;
          }),
        };
      default:
        throw new Error();
    }
  };
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isError: false,
    isLoading: false,
  });

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: "STORIES_FETCH_INIT" });

    try {
      const result = await axios.get(url);
      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    event.preventDefault();
  };

  const handleRemoveStories = (item) => {
    dispatchStories({
      type: "REMOVE_STORIES",
      payload: item,
    });
  };

  return (
    <div>
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      ></SearchForm>
      {stories.isError && <p> Something went wrong </p>}
      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStories} />
      )}
    </div>
  );
};

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => (
  <form onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      onInputChange={onSearchInput}
    >
      <strong>Search : </strong>
    </InputWithLabel>
    <button type="button" disabled={!searchTerm}>
      {" "}
      Submit{" "}
    </button>
  </form>
);

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

const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, 'title'),
  AUTHOR: (list) => sortBy(list, 'author'),
  COMMENT: (list) => sortBy(list, 'num_comments').reverse(),
  POINT: (list) => sortBy(list, 'points').reverse(),
};

const List = ({ list, onRemoveItem }) => {
  const [sort, setSort] = React.useState({
    sortKey: "NONE",
    isReverse: false
  });

  const handleSort = (sortKey) => {
    const isReverse = sort.sortKey === sortKey && !sort.isReverse; 
    setSort({sortKey: sortKey, isReverse: isReverse});
  };
  
  const sortFunction = SORTS[sort.sortKey];
  const sortedList = sort.isReverse? sortFunction(list).reverse() : sortFunction(list);

  return (
    <ul>
      <li style={{ display: "flex" }}>
        <span style={{ width: "40%" }}>
          <button type="button" onClick={() => handleSort("TITLE")}>
            Title
          </button>
        </span>
        <span style={{ width: "30%" }}>
          <button type="button" onClick={() => handleSort("AUTHOR")}>
            Author
          </button>
        </span>
        <span style={{ width: "10%" }}>
          <button type="button" onClick={() => handleSort("COMMENT")}>
            Comments
          </button>
        </span>
        <span style={{ width: "10%" }}>
          <button type="button" onClick={() => handleSort("POINT")}>
            Points
          </button>
        </span>
        <span style={{ width: "10%" }}> Actions </span>
      </li>
      {sortedList.map((book) => (
        <Item key={book.objectID} item={book} onRemoveItem={onRemoveItem} />
      ))}
    </ul>
  );
};

const Item = ({ item, onRemoveItem }) => {
  return (
    <li style={{ display: "flex" }}>
      <span style={{ width: "40%" }}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={{ width: "30%" }}>{item.author}</span>
      <span style={{ width: "10%" }}>{item.num_comments}</span>
      <span style={{ width: "10%" }}>{item.points}</span>
      <span style={{ width: "10%" }}>
        <button type="button" onClick={() => onRemoveItem(item)}>
          Dismiss
        </button>
      </span>
    </li>
  );
};

export default App;
