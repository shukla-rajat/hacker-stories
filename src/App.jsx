import * as React from 'react';

const Search = (props) => {
  return (
    <div>
      <h1> My Hacker Stories </h1>
      <label htmlFor="Search"> Search : </label>
      <input id="search" type="text" onChange={props.onSearch} />
    </div>
  );
};

const List = (props) => {
  return (
    <ul>
      {props.list.map((book) => (
        <Item  key={book.objectID} item={book} />
      ))}
    </ul>
  )
}

const Item = (props) => {
  return (
    <li>
      <span>Title: {props.item.title}</span><br/>
      <span>URL: {props.item.url}</span><br/>
      <span>Author: {props.item.author}</span><br/>
      <span>Points: {props.item.points}</span><br/>
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

  const [searchTerm, setSearchTerm] = React.useState(' ');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }

  const searchedStories = stories.filter( story => story.title.includes(searchTerm));

  return (
    <div>
      <Search onSearch={handleSearch}/>
      <List list={searchedStories} />
    </div>
  );
};

export default App;
