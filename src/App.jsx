function App() {
  const welcome = {
    greeting: 'Hello',
    title: 'React'
  };

  return (
    <div>
      <h1> {welcome.greeting} {welcome.title} </h1>

      <label htmlFor="Search"> Search : </label>
      <input id="search" type="text" />
    </div>
  );
}

export default App;
