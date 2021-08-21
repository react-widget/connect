import { mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";

import { createConnect, createCombineConnect } from "../src";

configure({ adapter: new Adapter() });

interface ITestContext1 {
  counter1: number;
  counter2: number;
}

interface ITestContext2 {
  counter3: number;
  counter4: number;
}

const TestContext1 = React.createContext<ITestContext1>(null);
const TestContext2 = React.createContext<ITestContext2>(null);
const CombineContexts = {
  context1: TestContext1,
  context2: TestContext2,
};

class Test extends React.Component {
  state = {
    counter1: 0,
    counter2: 0,
    counter3: 0,
    counter4: 0,
  };

  click(type: "counter1" | "counter2" | "counter3" | "counter4", cb?: () => void) {
    this.setState(
      {
        [type]: this.state[type] + 1,
      },
      cb
    );
  }

  render() {
    const { children } = this.props;

    return (
      <TestContext1.Provider
        value={{
          counter1: this.state.counter1,
          counter2: this.state.counter2,
        }}
      >
        <TestContext2.Provider
          value={{
            counter3: this.state.counter3,
            counter4: this.state.counter4,
          }}
        >
          {children}
        </TestContext2.Provider>
      </TestContext1.Provider>
    );
  }
}

test("connect", () => {
  function Counter(props: { counter: number }) {
    const renderCounterRef = React.useRef(0);
    renderCounterRef.current += 1;
    return (
      <div>
        <span className="counter">{props.counter}</span>
        <span className="render">{renderCounterRef.current}</span>
      </div>
    );
  }
  const connect = createConnect(TestContext1);

  function mapContextToProps(value) {
    return {
      counter: value.counter1,
    };
  }

  const ConnectTest = connect(mapContextToProps)(Counter);

  let testInstance: Test;

  const wrapper = mount(
    <Test ref={test => (testInstance = test)}>
      <ConnectTest />
    </Test>
  );

  testInstance.click("counter1");
  expect(wrapper.find(".counter").text()).toEqual("1");
  expect(wrapper.find(".render").text()).toEqual("2");

  testInstance.click("counter2");
  expect(wrapper.find(".counter").text()).toEqual("1");
  expect(wrapper.find(".render").text()).toEqual("2");

  testInstance.click("counter3");
  expect(wrapper.find(".counter").text()).toEqual("1");
  expect(wrapper.find(".render").text()).toEqual("2");

  testInstance.click("counter4");
  expect(wrapper.find(".counter").text()).toEqual("1");
  expect(wrapper.find(".render").text()).toEqual("2");

  testInstance.click("counter1");
  expect(wrapper.find(".counter").text()).toEqual("2");
  expect(wrapper.find(".render").text()).toEqual("3");
});

test("connect.useSelector", () => {
  const connect = createConnect(TestContext1);

  function Counter() {
    const renderCounterRef = React.useRef(0);
    const ctx = connect.useSelector(value => ({
      counter: value.counter1,
    }));

    return React.useMemo(() => {
      renderCounterRef.current += 1;

      return (
        <div>
          <span className="counter">{ctx.counter}</span>
          <span className="render">{renderCounterRef.current}</span>
        </div>
      );
    }, [ctx]);
  }

  let testInstance: Test;

  const wrapper = mount(
    <Test ref={test => (testInstance = test)}>
      <Counter />
    </Test>
  );

  testInstance.click("counter1");
  expect(wrapper.find(".counter").text()).toEqual("1");
  expect(wrapper.find(".render").text()).toEqual("2");

  testInstance.click("counter2");
  expect(wrapper.find(".counter").text()).toEqual("1");
  expect(wrapper.find(".render").text()).toEqual("2");

  testInstance.click("counter3");
  expect(wrapper.find(".counter").text()).toEqual("1");
  expect(wrapper.find(".render").text()).toEqual("2");

  testInstance.click("counter4");
  expect(wrapper.find(".counter").text()).toEqual("1");
  expect(wrapper.find(".render").text()).toEqual("2");

  testInstance.click("counter1");
  expect(wrapper.find(".counter").text()).toEqual("2");
  expect(wrapper.find(".render").text()).toEqual("3");
});

test("connect with pure false", () => {
  function Counter(props: { counter: number }) {
    const renderCounterRef = React.useRef(0);
    renderCounterRef.current += 1;
    return (
      <div>
        <span className="counter">{props.counter}</span>
        <span className="render">{renderCounterRef.current}</span>
      </div>
    );
  }
  const connect = createConnect(TestContext1);

  function mapContextToProps(value) {
    return {
      counter: value.counter1,
    };
  }

  const ConnectTest = connect(mapContextToProps, { pure: false })(Counter);

  let testInstance: Test;

  const wrapper = mount(
    <Test ref={test => (testInstance = test)}>
      <ConnectTest />
    </Test>
  );

  testInstance.click("counter1");
  expect(wrapper.find(".counter").text()).toEqual("1");
  expect(wrapper.find(".render").text()).toEqual("2");

  testInstance.click("counter2");
  expect(wrapper.find(".counter").text()).toEqual("1");
  expect(wrapper.find(".render").text()).toEqual("3");

  testInstance.click("counter3");
  expect(wrapper.find(".counter").text()).toEqual("1");
  expect(wrapper.find(".render").text()).toEqual("4");

  testInstance.click("counter4");
  expect(wrapper.find(".counter").text()).toEqual("1");
  expect(wrapper.find(".render").text()).toEqual("5");

  testInstance.click("counter1");
  expect(wrapper.find(".counter").text()).toEqual("2");
  expect(wrapper.find(".render").text()).toEqual("6");
});

test("combineConnect", () => {
  function Counter(props: { counter1: number; counter3: number }) {
    const renderCounterRef = React.useRef(0);
    renderCounterRef.current += 1;
    return (
      <div>
        <span className="counter1">{props.counter1}</span>
        <span className="counter3">{props.counter3}</span>
        <span className="render">{renderCounterRef.current}</span>
      </div>
    );
  }
  const connect = createCombineConnect(CombineContexts);

  const ConnectTest = connect(function mapContextToProps(values) {
    return {
      counter1: values.context1.counter1,
      counter3: values.context2.counter3,
    };
  })(Counter);

  let testInstance: Test;

  const wrapper = mount(
    <Test ref={test => (testInstance = test)}>
      <ConnectTest />
    </Test>
  );

  testInstance.click("counter1");
  expect(wrapper.find(".counter1").text()).toEqual("1");
  expect(wrapper.find(".counter3").text()).toEqual("0");
  expect(wrapper.find(".render").text()).toEqual("2");

  testInstance.click("counter2");
  expect(wrapper.find(".counter1").text()).toEqual("1");
  expect(wrapper.find(".counter3").text()).toEqual("0");
  expect(wrapper.find(".render").text()).toEqual("2");

  testInstance.click("counter3");
  expect(wrapper.find(".counter1").text()).toEqual("1");
  expect(wrapper.find(".counter3").text()).toEqual("1");
  expect(wrapper.find(".render").text()).toEqual("3");

  testInstance.click("counter4");
  expect(wrapper.find(".counter1").text()).toEqual("1");
  expect(wrapper.find(".counter3").text()).toEqual("1");
  expect(wrapper.find(".render").text()).toEqual("3");

  testInstance.click("counter1");
  expect(wrapper.find(".counter1").text()).toEqual("2");
  expect(wrapper.find(".counter3").text()).toEqual("1");
  expect(wrapper.find(".render").text()).toEqual("4");
});

test("combineConnect.useSelector", () => {
  const connect = createCombineConnect(CombineContexts);

  function Counter() {
    const renderCounterRef = React.useRef(0);
    const ctx = connect.useSelector(values => ({
      counter1: values.context1.counter1,
      counter3: values.context2.counter3,
    }));

    return React.useMemo(() => {
      renderCounterRef.current += 1;

      return (
        <div>
          <span className="counter1">{ctx.counter1}</span>
          <span className="counter3">{ctx.counter3}</span>
          <span className="render">{renderCounterRef.current}</span>
        </div>
      );
    }, [ctx]);
  }

  let testInstance: Test;

  const wrapper = mount(
    <Test ref={test => (testInstance = test)}>
      <Counter />
    </Test>
  );

  testInstance.click("counter1");
  expect(wrapper.find(".counter1").text()).toEqual("1");
  expect(wrapper.find(".counter3").text()).toEqual("0");
  expect(wrapper.find(".render").text()).toEqual("2");

  testInstance.click("counter2");
  expect(wrapper.find(".counter1").text()).toEqual("1");
  expect(wrapper.find(".counter3").text()).toEqual("0");
  expect(wrapper.find(".render").text()).toEqual("2");

  testInstance.click("counter3");
  expect(wrapper.find(".counter1").text()).toEqual("1");
  expect(wrapper.find(".counter3").text()).toEqual("1");
  expect(wrapper.find(".render").text()).toEqual("3");

  testInstance.click("counter4");
  expect(wrapper.find(".counter1").text()).toEqual("1");
  expect(wrapper.find(".counter3").text()).toEqual("1");
  expect(wrapper.find(".render").text()).toEqual("3");

  testInstance.click("counter1");
  expect(wrapper.find(".counter1").text()).toEqual("2");
  expect(wrapper.find(".counter3").text()).toEqual("1");
  expect(wrapper.find(".render").text()).toEqual("4");
});

test("combineConnect with pure false", () => {
  function Counter(props: { counter1: number; counter3: number }) {
    const renderCounterRef = React.useRef(0);
    renderCounterRef.current += 1;
    return (
      <div>
        <span className="counter1">{props.counter1}</span>
        <span className="counter3">{props.counter3}</span>
        <span className="render">{renderCounterRef.current}</span>
      </div>
    );
  }
  const connect = createCombineConnect(CombineContexts);

  const ConnectTest = connect(
    function mapContextToProps(values) {
      return {
        counter1: values.context1.counter1,
        counter3: values.context2.counter3,
      };
    },
    {
      pure: false,
    }
  )(Counter);

  let testInstance: Test;

  const wrapper = mount(
    <Test ref={test => (testInstance = test)}>
      <ConnectTest />
    </Test>
  );

  testInstance.click("counter1");
  expect(wrapper.find(".counter1").text()).toEqual("1");
  expect(wrapper.find(".counter3").text()).toEqual("0");
  expect(wrapper.find(".render").text()).toEqual("2");

  testInstance.click("counter2");
  expect(wrapper.find(".counter1").text()).toEqual("1");
  expect(wrapper.find(".counter3").text()).toEqual("0");
  expect(wrapper.find(".render").text()).toEqual("3");

  testInstance.click("counter3");
  expect(wrapper.find(".counter1").text()).toEqual("1");
  expect(wrapper.find(".counter3").text()).toEqual("1");
  expect(wrapper.find(".render").text()).toEqual("4");

  testInstance.click("counter4");
  expect(wrapper.find(".counter1").text()).toEqual("1");
  expect(wrapper.find(".counter3").text()).toEqual("1");
  expect(wrapper.find(".render").text()).toEqual("5");

  testInstance.click("counter1");
  expect(wrapper.find(".counter1").text()).toEqual("2");
  expect(wrapper.find(".counter3").text()).toEqual("1");
  expect(wrapper.find(".render").text()).toEqual("6");
});
