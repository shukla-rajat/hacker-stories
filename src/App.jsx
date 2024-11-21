import * as React from 'react';

const Search = (props) => {
  console.log('Search renders');
  const [searchTerm, setSearchTerm] = React.useState(' ');
  
  const handleChange = (event) => {
    props.onSearch(event);
    console.log(event);
    console.log(event.target.value);
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <h1> My Hacker Stories </h1>
      <label htmlFor="Search"> Search : </label>
      <input id="search" type="text" onChange={handleChange} />
      <p> Search Term: <strong>{searchTerm}</strong> </p>
    </div>
  );
};

const List = (props) => {
  console.log('List renders');
  return (
    <ul>
      {props.list.map((book) => (
        <Item  key={book.objectID} item={book} />
      ))}
    </ul>
  )
}

const Item = (props) => {
  console.log('Item renders');
  return (
    <li>
      <span>Title: {props.item.title}</span>
      <span>URL: {props.item.url}</span>
      <span>Author: {props.item.author}</span>
      <span>Points: {props.item.points}</span>
    </li>
  );
};

const App = () => {
  console.log('App renders');
  const handleSearch = (event) => {
    console.log("callback handler", event.target.value);
  }
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
  
  return (
    <div>
      <Search onSearch={handleSearch}/>
      <List list={stories} />
    </div>
  );
};

export default App;
