import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import {
  Context,
  combineConnect,
  Counter1Context,
  Counter2Context,
  Counter3Context,
  Counter4Context,
} from "./Context";
import Counter, { CombineCounterConnect } from "./Counter";

class App extends React.Component {
  state = {
    counter1: 0,
    counter2: 0,
    counter3: 0,
    counter4: 0,
  };

  handleCounter1 = () => {
    this.setState({
      counter1: this.state.counter1 + 1,
    });
  };
  handleCounter2 = () => {
    this.setState({
      counter2: this.state.counter2 + 1,
    });
  };
  handleCounter3 = () => {
    this.setState({
      counter3: this.state.counter3 + 1,
    });
  };
  handleCounter4 = () => {
    this.setState({
      counter4: this.state.counter4 + 1,
    });
  };

  render() {
    return (
      <div className="main">
        <Context.Provider value={this.state}>
          <Counter1Context.Provider
            value={{
              value: this.state.counter1,
            }}
          >
            <Counter2Context.Provider
              value={{
                value: this.state.counter2,
              }}
            >
              <Counter3Context.Provider
                value={{
                  value: this.state.counter3,
                }}
              >
                <Counter4Context.Provider
                  value={{
                    value: this.state.counter4,
                  }}
                >
                  <Counter type="counter1" onClick={this.handleCounter1} />
                  <Counter type="counter2" onClick={this.handleCounter2} />
                  <Counter type="counter3" onClick={this.handleCounter3} />
                  <Counter type="counter4" onClick={this.handleCounter4}>
                    <span>由于该组件children每次都是新的，所以每次都会刷新</span>
                  </Counter>
                  <CombineCounterConnect></CombineCounterConnect>
                </Counter4Context.Provider>
              </Counter3Context.Provider>
            </Counter2Context.Provider>
          </Counter1Context.Provider>
        </Context.Provider>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
