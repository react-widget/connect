import React from "react";
import { createCombineConnect, createContextConnect } from "../src";

export interface IContext {
  counter1: number;
  counter2: number;
  counter3: number;
  counter4: number;
}

export const Context = React.createContext<IContext>(null as any);

export const connect = createContextConnect(Context);

interface ICounter1Context {
  value: number;
}
interface ICounter2Context {
  value: number;
}
interface ICounter3Context {
  value: number;
}
interface ICounter4Context {
  value: number;
}

export const Counter1Context = React.createContext<ICounter1Context>(null as any);
export const Counter2Context = React.createContext<ICounter2Context>(null as any);
export const Counter3Context = React.createContext<ICounter3Context>(null as any);
export const Counter4Context = React.createContext<ICounter4Context>(null as any);

export const combineConnect = createCombineConnect({
  counter1: Counter1Context,
  counter2: Counter2Context,
  counter3: Counter3Context,
  counter4: Counter4Context,
});
