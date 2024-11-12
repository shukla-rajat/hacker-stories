function getTitle(title) {
  return title;
}

function App() {
  return (
    <div>
      <h1> {getTitle("React")} </h1>

      <label htmlFor="Search"> Search : </label>
      <input id="search" type="text" />
    </div>
  );
}

export default App;
