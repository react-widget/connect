import React from "react";
import { connect, combineConnect } from "./Context";

function RenderCounter(props) {
  let [counter, update] = React.useState(0);

  React.useEffect(() => {
    update(counter + 1);
  }, [props]);

  return (
    <span
      style={{
        marginTop: 8,
        color: "#7b7b7b",
      }}
    >
      当前组件刷新次数：{counter}
    </span>
  );
}

interface CounterProps {
  type: string;
  counter: number;
  onClick: () => void;
  children?: React.ReactNode;
}

function Counter(props: CounterProps) {
  return (
    <div className="counter">
      <div style={{ padding: 16 }}>
        <button onClick={() => props.onClick()}>点击({props.type})</button>
        <span style={{ marginLeft: 8 }}>{props.counter} 次</span>
        <div>
          <RenderCounter />
        </div>
        <div>{props.children}</div>
      </div>
    </div>
  );
}

export default connect((value, props: CounterProps) => ({
  counter: value[props.type],
}))(Counter);

interface CombineCounterProps {
  counter1: number;
  counter3: number;
}

function CombineCounter(props: CombineCounterProps) {
  return (
    <div className="counter">
      <div style={{ padding: 16 }}>
        <div>counter1点击 {props.counter1} 次</div>
        <div>counter3点击 {props.counter3} 次</div>
        <div>
          <RenderCounter />
        </div>
      </div>
    </div>
  );
}

export const CombineCounterConnect = combineConnect(values => {
  return {
    counter1: values.counter1.value,
    counter3: values.counter3.value,
  };
})(CombineCounter);
