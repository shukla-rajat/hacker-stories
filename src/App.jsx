function App() {
  const title = "React";

  return (
    <div>
      <h1> Hello {title} ! </h1>

      <label htmlFor="Search"> Search : </label>
      <input id="search" type="text" />
    </div>
  );
}

export default App;
