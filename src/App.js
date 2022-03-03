import logo from "./logo.svg";
import "./App.css";
import "./index.css";

import SwitchRouter from "./components/switchRouter";
import Navbar from "./components/navbar";

function App() {
  return (
    <div className="App">
      <Navbar />
      <SwitchRouter />
    </div>
  );
}

export default App;
