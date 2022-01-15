import { React } from "react";
import Cards from "./Cards.js";
import "./App.css";

function App() {
  const cards_array = [];

  return (
    <div>
      <Cards cards={cards_array} />
    </div>
  );
}

export default App;
