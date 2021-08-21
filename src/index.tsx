import React from "react";
import shallowEqual from "./shallowEqual";

type CombineContext = Record<string, React.Context<any>>;

type GetCombineContextValue<T extends CombineContext> = {
  [P in keyof T]: React.ContextType<T[P]>;
};

const MemoComponent = React.memo(
  ({
    __ConnectComponent__: ConnectComponent,
    __ConnectComponentRef__: ConnectComponentRef,
    ...props
  }: any) => {
    return <ConnectComponent {...props} ref={ConnectComponentRef} />;
  }
);

export interface ConnectOpts {
  pure?: boolean;
}

export function createConnect<T extends React.Context<any>>(Context: T) {
  function connect<M extends (value: React.ContextType<T>, ownProps: any) => any>(
    mapContextToProps: M,
    opts: ConnectOpts = {}
  ) {
    const { pure = true } = opts;
    return <C extends React.ComponentType<ReturnType<M>>>(Component: C) => {
      const forwardConnectRef: React.ForwardRefRenderFunction<
        C,
        Omit<React.ComponentProps<C>, keyof ReturnType<M>> & Partial<ReturnType<M>>
      > = (props, ref) => (
        <Context.Consumer>
          {value => {
            const mappedProps = {
              ...props,
              ...mapContextToProps(value, props),
            };

            return pure ? (
              <MemoComponent
                {...mappedProps}
                __ConnectComponent__={Component}
                __ConnectComponentRef__={ref}
              ></MemoComponent>
            ) : (
              <Component {...mappedProps} ref={ref} />
            );
          }}
        </Context.Consumer>
      );

      return React.forwardRef(forwardConnectRef);
    };
  }

  connect.useSelector = function <M extends (value: React.ContextType<T>) => any>(
    selector: M,
    equalityFn: (oldValue: ReturnType<M>, newValue: ReturnType<M>) => boolean = shallowEqual
  ) {
    const currentValueRef = React.useRef<ReturnType<M>>(null);
    const value = selector(React.useContext(Context));

    if (!equalityFn(currentValueRef.current, value)) {
      currentValueRef.current = value;
    }

    return currentValueRef.current;
  };

  return connect;
}

export function createCombineConnect<T extends CombineContext>(contexts: T) {
  const keys: Array<keyof T> = Object.keys(contexts);
  const CombineContext = React.createContext({} as GetCombineContextValue<T>);
  const CombineComponent = ({ children }) => {
    const values: GetCombineContextValue<T> = Object.create(null);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      values[key] = React.useContext<React.ContextType<T[string]>>(contexts[key]);
    }

    return <CombineContext.Provider value={values}>{children}</CombineContext.Provider>;
  };

  const Consumer_ = CombineContext.Consumer;

  (CombineContext as any).Consumer = function (props: React.ComponentProps<typeof Consumer_>) {
    return (
      <CombineComponent>
        <Consumer_ {...props} />
      </CombineComponent>
    );
  };

  return createConnect(CombineContext);
}

export const version = "%VERSION%";

export default createConnect;
