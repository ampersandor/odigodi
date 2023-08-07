import { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import Contact from "./pages/Contact/Contact";
import Home from "./pages/Home";


class App extends Component {
  render() {
    return (
      <>
        <Navbar/>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/Contact' element={<Contact />} />
          </Routes>
      </>
    );
  }
}

export default App;
