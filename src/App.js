import './App.css';
import { ReactComponent as MapIcon } from './seoul.svg'
import { ReactComponent as Songpa } from './songpa2.svg'
import SvgDelete from './mycompo';

function App() {
  return (
    <div>
      {/* <MapIcon width={1400} height={1400} fill="#dd9c4f" d="M 621 374 l 6 2 4 2 4 4 0 8 -2 5 -1 3 0 7 5 2 8 5 5 3 8 4 3 2 5 3 5 2 -4 3 0 6 -3 10 4 5 5 3 10 0 9 3 5 5 -1 4 -2 7 -3 9 -4 3 -5 4 -5 5 -2 6 -3 7 -5 5 -10 0 -6 0 0 8 -4 5 -6 -2 -2 -1 -1 4 -4 -5 -3 -4 -5 -10 -2 -2 -4 -7 -3 -5 -3 -5 -3 -6 -5 -5 -5 -4 -6 -3 -5 -3 -5 -2 -12 -4 -3 -2 -6 -2 -7 -1 -6 -2 -1 -10 -1 -6 -1 -13 0 -4 0 -10 6 2 5 1 5 1 5 -1 6 -3 8 -5 3 -2 3 -3 11 -12 5 -4 5 -5 4 -5 z " /> */}
      {/* <Songpa width={200} height={200} /> */}
      <SvgDelete d={"M420.3 186.5 l 12 4 8 4 8 8 0 16 -4 10 -2 6 0 14 10 4 16 10 10 6 16 8 6 4 10 6 10 4 -8 6 0 12 -6 20 8 10 10 6 20 0 18 6 10 10 -2 8 -4 14 -6 18 -8 6 -10 8 -10 10 -4 12 -6 14 -10 10 -20 0 -12 0 0 16 -8 10 -12 -4 -4 -2 -2 8 -8 -10 -6 -8 -10 -20 -4 -4 -8 -14 -6 -10 -6 -10 -6 -12 -10 -10 -10 -8 -12 -6 -10 -6 -10 -4 -24 -8 -6 -4 -12 -4 -14 -2 -12 -4 -2 -20 -2 -12 -2 -26 0 -8 0 -20 12 4 10 2 10 2 10 -2 12 -6 16 -10 6 -4 6 -6 22 -24 10 -8 10 -10 8 -10 z "}></SvgDelete>
    </div>
  );
}

export default App;

{/* <div className="App">
<header className="App-header">
  <img src={logo} className="App-logo" alt="logo" />
  
  <p>
    Edit <code>src/App.js</code> and save to reload.
  </p>
  <a
    className="App-link"
    href="https://reactjs.org"
    target="_blank"
    rel="noopener noreferrer"
  >
    Learn React
  </a>
</header>
</div> */}