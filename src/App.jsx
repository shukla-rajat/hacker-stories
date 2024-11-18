const list = [
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

function Search() {
  return (
    <div>
      <h1> My Hacker Stories </h1>
      <label htmlFor="Search"> Search : </label>
      <input id="search" type="text" />
    </div>
  );
}

function List() {
  return (
    <ul>
      {list.map((book) => {
        return (
          <li key={book.objectID}>
            <span>Title: {book.title}</span>
            <span>URL: {book.url}</span>
            <span>Author: {book.author}</span>
            <span>Points: {book.points}</span>
          </li>
        );
      })}
    </ul>
  );
}

function App() {
  return (
    <div>
      <Search />
      <List />
    </div>
  );
}

export default App;
