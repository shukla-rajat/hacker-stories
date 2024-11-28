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
        <Item key={book.objectID} title={book.title} url={book.url} author={ book.author} points={book.points}/>
      ))}
    </ul>
  );
};

const Item = ({ title, url, author, points }) => {
  return (
    <li>
      <span>Title: {title}</span>
      <br />
      <span>URL: {url}</span>
      <br />
      <span>Author: {author}</span>
      <br />
      <span>Points: {points}</span>
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

  const [searchTerm, setSearchTerm] = React.useState("React");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter((story) =>
    story.title.includes(searchTerm)
  );

  return (
    <div>
      <Search search={searchTerm} onSearch={handleSearch} />
      <List list={searchedStories} />
    </div>
  );
};

export default App;
