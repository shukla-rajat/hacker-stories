import * as React from "react";
import axios from "axios";

type Story =  {
  objectID: string,
  title: string,
  url: string,
  author: string,
  points: number
};

type ItemProps = {
  item: Story;
  onRemoveItem: (item: Story) => void;
}

type ListProps = {
  list: Story[];
  onRemoveItem: (item:Story) =>void;
}

type StoriesState = {
  data: Story[];
  isError: boolean;
  isLoading: boolean;
}

type StoriesFetchInitAction = {
  type: 'STORIES_FETCH_INIT'
};

type StoriesFetchSuccessAction = {
  type: 'STORIES_FETCH_SUCCESS';
  payload: Story[];
}

type StoriesFetchFailureAction = {
  type: 'STORIES_FETCH_FAILURE'
}

type StoriesRemoveAction = {
  type: 'REMOVE_STORY';
  payload: Story;
}

type StoriesAction = StoriesFetchInitAction | StoriesFetchSuccessAction | StoriesFetchFailureAction | StoriesRemoveAction;

type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

type InputWithLabelProps = {
  id: string;
  value: string;
  type?: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isFocused?: boolean;
  children: React.ReactNode;
};

const useStorageState = (key: string, initialState: string) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue] as const;
};

const InputWithLabel = ({
  id,
  type = "text",
  value,
  onInputChange,
  isFocused = true,
  children,
}: InputWithLabelProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

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

const List = ({ list, onRemoveItem }: ListProps) => {
  return (
    <ul>
      {list.map((book) => (
        <Item key={book.objectID} item={book} onRemoveItem={onRemoveItem} />
      ))}
    </ul>
  );
};

const Item = ({ item, onRemoveItem }: ItemProps) => {
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

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit } : SearchFormProps) => (
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

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState("search", "React");

  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const storiesReducer = (state: StoriesState, action: StoriesAction) => {
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
      case "REMOVE_STORY":
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

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    event.preventDefault();
  };

  const handleRemoveStories = (item: Story) => {
    dispatchStories({
      type: "REMOVE_STORY",
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

export default App;
