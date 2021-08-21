# react-widget-connect
将`React`的`Context`通过`connect`连接到组件，类似`React Redux`的`connect`

## 安装

`npm install --save react-widget-connect`

## 使用

```tsx
import { createConnect,createCombineConnect } from 'react-widget-create-context-connect'

interface IContext1 {
  name: string
  gender: number
}
interface IContext2 {
  age: number
}

const connect = createConnect(IContext1)
const combineConnect = createCombineConnect({
  ctx1:IContext1,
  ctx2:IContext2,
})

// Component.ts
function Component(props: {username: string, age: number}){
  // TODO:
}

// 连接单个Context到组件
export default connect((value, ownProps) => {
  // value.name
  // value.gender
  return {
    username: value.name
  }
})(Component)

// 或

// 连接多个Context到组件
export default  combineConnect((values, ownProps) => {
  // values.ctx1.name
  // values.ctx1.gender
  // values.ctx2.age
  return {
     username: values.ctx1.name
  }
})(Component)


// App.tsx
import Component from './Component'

<Component age={18} />

```

如不想用`connect(...)(Component)`的方式，也提供了hooks获取关联的`Context`数据，示例：

```tsx
// App.tsx
function App(){
  const info = connect.useSelector( value => ({
    username: value.name
  }))

 return React.useMemo(() => <div>{info.username}</div>, [info])
}

```


