const Search = () => {
  const handleChange = (event) => {
    console.log(event);
    console.log(event.target.value);
  };

  return (
    <div>
      <h1> My Hacker Stories </h1>
      <label htmlFor="Search"> Search : </label>
      <input id="search" type="text" onChange={handleChange} />
    </div>
  );
};

const List = (props) => (
  <ul>
    {props.list.map((book) => (
      <li key={book.objectID}>
        <Item item={book} />
      </li>
    ))}
  </ul>
);

const Item = (props) => {
  return (
    <div>
      <span>Title: {props.item.title}</span>
      <span>URL: {props.item.url}</span>
      <span>Author: {props.item.author}</span>
      <span>Points: {props.item.points}</span>
    </div>
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
  return (
    <div>
      <Search />
      <List list={stories} />
    </div>
  );
};

export default App;
