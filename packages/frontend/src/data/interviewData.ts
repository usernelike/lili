export interface KnowledgeItem {
  id: string
  question: string
  answer: string
  tags?: string[]
}

export interface KnowledgeCategory {
  id: string
  name: string
  items: KnowledgeItem[]
}

const interviewData: KnowledgeCategory[] = [
  {
    id: 'html-css',
    name: 'HTML / CSS',
    items: [
      {
        id: 'box-model',
        question: '什么是 CSS 盒模型？',
        answer: `CSS 盒模型描述了一个元素在页面中占据的空间，由四部分组成：
• content：内容区域，显示文本和图像
• padding：内边距，内容与边框之间的空间
• border：边框，围绕 padding 的线条
• margin：外边距，元素与其他元素之间的空间

标准盒模型（box-sizing: content-box）中，width/height 只包含 content。
怪异盒模型（box-sizing: border-box）中，width/height 包含 content + padding + border，更直观易用。`,
        tags: ['基础', '布局'],
      },
      {
        id: 'bfc',
        question: '什么是 BFC？如何创建？有什么作用？',
        answer: `BFC（Block Formatting Context，块级格式化上下文）是 CSS 中一个独立的渲染区域，内部元素的布局不会影响外部元素。

创建 BFC 的常见方式：
• overflow: hidden / auto / scroll
• display: inline-block / flex / grid / table-cell
• position: absolute / fixed
• float: left / right

BFC 的作用：
• 清除浮动（包含浮动子元素）
• 阻止 margin 重叠
• 防止元素被浮动元素覆盖`,
        tags: ['布局', '进阶'],
      },
      {
        id: 'flex-center',
        question: 'CSS 居中有哪些常见方案？',
        answer: `水平居中：
• text-align: center（行内元素）
• margin: 0 auto（块级元素定宽）
• flex: justify-content: center
• grid: place-items: center

垂直居中：
• line-height = height（单行文本）
• flex: align-items: center
• grid: place-items: center
• position + transform: translate(-50%, -50%)

水平垂直居中（最常用）：
• display: flex; justify-content: center; align-items: center;
• display: grid; place-items: center;
• position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);`,
        tags: ['布局', '基础'],
      },
      {
        id: 'repaint-reflow',
        question: '什么是重绘（Repaint）和回流（Reflow）？如何优化？',
        answer: `回流（Reflow）：当元素的尺寸、位置、布局发生变化时，浏览器需要重新计算渲染树并重新布局。开销大。
触发回流的操作：修改 width/height、margin/padding、offsetTop/Left 读取、字体大小变化、添加/删除可见 DOM 节点。

重绘（Repaint）：当元素的外观（颜色、背景、阴影等）改变但不影响布局时，浏览器只需重新绘制像素。开销较小。

优化策略：
• 批量修改样式（使用 class 替代逐条修改 style）
• 离线操作 DOM（cloneNode、DocumentFragment、display: none 后操作）
• 缓存布局信息（避免循环中重复读取 offsetHeight 等）
• 使用 transform 和 opacity 动画（会提升为合成层，避免回流）
• 使用 will-change 提示浏览器优化`,
        tags: ['性能', '渲染'],
      },
      {
        id: 'responsive',
        question: '响应式布局的实现方案有哪些？',
        answer: `• 媒体查询（@media）：根据不同屏幕宽度应用不同样式
• 百分比 / vw vh 单位：元素尺寸随视口变化
• Flexbox 弹性布局：自动分配剩余空间
• CSS Grid 网格布局：二维布局系统
• rem / em：基于根字体或父元素字体缩放
• 移动优先（Mobile First）或桌面优先策略
• 使用响应式框架（Tailwind、Bootstrap）`,
        tags: ['布局', '移动端'],
      },
    ],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    items: [
      {
        id: 'prototype',
        question: '原型和原型链是什么？',
        answer: `每个 JS 对象都有一个内部属性 [[Prototype]]（通过 __proto__ 访问），指向它的原型对象。

原型链：当访问对象的属性时，如果对象本身没有，就会沿着 __proto__ 向上查找，直到找到该属性或到达原型链顶端（null）。

构造函数有一个 prototype 属性，指向实例的原型对象。new 操作符创建实例时，实例的 __proto__ 指向构造函数的 prototype。

类（class）的继承本质上是原型链的语法糖。`,
        tags: ['基础', '面向对象'],
      },
      {
        id: 'closure',
        question: '什么是闭包？有什么应用场景？',
        answer: `闭包是指一个函数能够记住并访问它的词法作用域，即使这个函数在其词法作用域之外执行。

形成条件：
• 函数嵌套
• 内部函数引用了外部函数的变量
• 内部函数被返回或传递到外部

应用场景：
• 数据私有化（模拟私有变量）
• 函数柯里化（Currying）
• 防抖（debounce）和节流（throttle）
• 缓存计算结果（memoize）
• 循环中使用异步操作（let/const + 闭包保存每次迭代的值）`,
        tags: ['基础', '进阶'],
      },
      {
        id: 'event-loop',
        question: '事件循环（Event Loop）机制是什么？',
        answer: `JS 是单线程的，事件循环是其实现异步非阻塞的机制。

执行流程：
1. 同步代码进入主线程（调用栈）执行
2. 异步操作（定时器、Promise、网络请求）交给对应的 Web API 处理
3. 异步操作完成后，回调放入对应的任务队列：
   • 微任务（Microtask）：Promise.then/catch/finally、MutationObserver、queueMicrotask
   • 宏任务（Macrotask）：setTimeout、setInterval、setImmediate、I/O、UI rendering
4. 当调用栈为空时，Event Loop 先清空所有微任务，再执行一个宏任务，然后再次检查微任务...

注意：await 后面的代码相当于放入微任务队列。`,
        tags: ['核心', '异步'],
      },
      {
        id: 'promise',
        question: 'Promise 的状态有哪些？async/await 的原理是什么？',
        answer: `Promise 三种状态：pending（进行中）、fulfilled（已成功）、rejected（已失败）。状态一旦改变就不可再变。

Promise 方法：
• then(onFulfilled, onRejected)：链式调用
• catch(onRejected)：捕获错误
• finally()：无论成功失败都执行
• Promise.all()：全部成功才成功，一个失败就失败
• Promise.race()：返回最先完成的那个
• Promise.allSettled()：等所有完成，返回各自结果
• Promise.any()：任意一个成功就成功

async/await 本质：
• async 函数总是返回 Promise
• await 会暂停 async 函数执行，等待 Promise 完成，然后恢复执行
• await 底层通过 generator + Promise 实现（可理解为语法糖）`,
        tags: ['异步', 'ES6'],
      },
      {
        id: 'this',
        question: 'this 的指向规则是什么？',
        answer: `this 的指向在函数调用时确定：

1. 默认绑定：独立函数调用，非严格模式指向 window/global，严格模式指向 undefined
2. 隐式绑定：通过对象调用（obj.fn()），this 指向 obj
3. 显式绑定：call/apply/bind 指定 this
4. new 绑定：构造函数中的 this 指向新创建的实例
5. 箭头函数：没有自己的 this，继承外层作用域的 this

常见陷阱：
• setTimeout 中的回调函数 this 指向 window（可用箭头函数或 bind 修正）
• 事件监听器的 this 默认指向触发元素（箭头函数则继承外层）`,
        tags: ['基础', '核心'],
      },
      {
        id: 'deep-clone',
        question: '深拷贝和浅拷贝的区别？如何实现深拷贝？',
        answer: `浅拷贝：只复制对象的第一层属性，嵌套对象仍然共享引用。
实现：Object.assign()、展开运算符 {...obj}、Array.prototype.slice()

深拷贝：完全复制一个新对象，所有层级都是独立的。
实现方式：
• JSON.parse(JSON.stringify(obj)) — 简单但不支持函数、undefined、Date、RegExp、循环引用、Map/Set
• 递归手写 — 处理各种类型（基本类型、数组、对象、Date、RegExp、Map、Set、循环引用用 WeakMap 解决）
• structuredClone() — 原生 API，支持更多类型但不支持函数
• lodash.cloneDeep — 最完善的方案`,
        tags: ['基础', '进阶'],
      },
      {
        id: 'debounce-throttle',
        question: '防抖（debounce）和节流（throttle）的区别和实现？',
        answer: `防抖（debounce）：事件触发后等待一段时间，如果期间再次触发则重新计时。只执行最后一次。
应用场景：搜索框输入、窗口 resize、表单验证。

节流（throttle）：事件触发后，在一定时间间隔内只执行一次。
应用场景：滚动加载、mousemove 拖拽、游戏射击。

实现要点：
• 防抖使用 setTimeout + clearTimeout
• 节流可以使用时间戳或 setTimeout
• 都可以加入 leading（首次立即执行）和 trailing（结束后执行一次）选项`,
        tags: ['性能', '高频面试'],
      },
      {
        id: 'es6-features',
        question: 'ES6+ 有哪些重要新特性？',
        answer: `• let / const：块级作用域，const 声明常量
• 箭头函数：简写语法，无自己的 this
• 模板字符串：支持换行和插值
• 解构赋值：数组/对象解构
• 展开运算符：... 展开数组和对象
• Promise：异步编程标准化
• async/await：异步代码同步化写法
• Class：面向对象语法糖
• Map / Set / WeakMap / WeakSet：新数据结构
• Symbol：唯一标识符
• Proxy / Reflect：元编程能力
• 模块化（import / export）
• 可选链（?.）和空值合并（??）
• BigInt：大整数运算`,
        tags: ['ES6', '基础'],
      },
    ],
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    items: [
      {
        id: 'ts-basic',
        question: 'TypeScript 相比 JavaScript 的优势？',
        answer: `• 静态类型检查：在编译期发现类型错误，减少运行时 bug
• 更好的 IDE 支持：智能提示、自动补全、重构支持
• 增强代码可读性和可维护性：类型即文档
• 支持新特性编译：将 ES6+ 编译为兼容的 JS
• 强化的面向对象能力：接口、抽象类、泛型、访问修饰符`,
        tags: ['基础'],
      },
      {
        id: 'ts-interface-type',
        question: 'interface 和 type 的区别？',
        answer: `相同点：都可以定义对象结构、支持继承/交叉、都可以描述函数。

不同点：
• interface 支持声明合并（多次定义同名 interface 自动合并），type 不支持
• type 可以定义联合类型（A | B）、交叉类型（A & B）、元组、基本类型别名
• interface 的 extends 用于继承，type 使用 & 进行交叉
• type 可以使用条件类型、映射类型等高级类型操作

使用建议：
• 定义对象结构优先用 interface
• 需要联合类型、条件类型等用 type`,
        tags: ['基础', '高频面试'],
      },
      {
        id: 'ts-generic',
        question: '什么是泛型？有什么应用场景？',
        answer: `泛型（Generics）允许定义灵活的、可重用的组件，同时保持类型安全。

基本语法：<T>，T 是类型变量，使用时再传入具体类型。

应用场景：
• 泛型函数：function identity<T>(arg: T): T { return arg }
• 泛型接口：interface Response<T> { data: T; code: number }
• 泛型类：class Queue<T> { items: T[] = []; push(item: T) {} }
• 工具类型：Partial<T>、Required<T>、Pick<T, K>、Omit<T, K>、Record<K, T>
• 约束泛型：function fn<T extends { length: number }>(arg: T) {}`,
        tags: ['进阶', '类型系统'],
      },
      {
        id: 'ts-infer',
        question: 'TS 中的 infer 关键字是什么？',
        answer: `infer 用于在条件类型中推断类型变量。

示例：提取数组元素类型
• type ElementType<T> = T extends (infer U)[] ? U : never

示例：提取函数返回类型
• type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

infer 只能在 extends 子句的右侧使用，用来从复杂类型中提取子类型。`,
        tags: ['进阶', '类型系统'],
      },
    ],
  },
  {
    id: 'react',
    name: 'React',
    items: [
      {
        id: 'react-lifecycle',
        question: 'React 类组件的生命周期有哪些？',
        answer: `挂载阶段：
• constructor：初始化 state 和绑定方法
• static getDerivedStateFromProps：根据 props 更新 state（少用）
• render：返回 JSX
• componentDidMount：DOM 已挂载，可执行副作用（请求数据、订阅）

更新阶段：
• static getDerivedStateFromProps
• shouldComponentUpdate：控制是否重新渲染（性能优化）
• render
• getSnapshotBeforeUpdate：在 DOM 更新前获取信息（如滚动位置）
• componentDidUpdate：DOM 已更新

卸载阶段：
• componentWillUnmount：清理副作用（取消订阅、清除定时器）

错误处理：
• componentDidCatch / static getDerivedStateFromError：错误边界`,
        tags: ['基础', '类组件'],
      },
      {
        id: 'react-hooks',
        question: '常用 Hooks 有哪些？使用规则是什么？',
        answer: `基础 Hooks：
• useState：管理状态，返回 [state, setState]
• useEffect：处理副作用，相当于 componentDidMount + componentDidUpdate + componentWillUnmount
• useContext：订阅上下文，避免 prop drilling
• useRef：获取 DOM 引用或保存不变值（不触发重渲染）

性能优化 Hooks：
• useMemo：缓存计算结果
• useCallback：缓存函数引用
• React.memo：组件级别的浅比较优化

其他 Hooks：
• useReducer：复杂状态逻辑管理
• useLayoutEffect：同步执行副作用（在浏览器绘制前执行）
• useImperativeHandle：自定义暴露给父组件的实例值
• useId：生成唯一 ID（React 18）

Hooks 规则：
• 只能在函数组件顶层调用，不能在循环/条件/嵌套函数中调用
• 只能在 React 函数组件或自定义 Hooks 中调用
• 以 use 开头的函数即为自定义 Hook`,
        tags: ['核心', '高频面试'],
      },
      {
        id: 'react-vdom',
        question: 'Virtual DOM 是什么？Diff 算法原理？',
        answer: `Virtual DOM 是真实 DOM 的轻量级 JavaScript 对象表示。React 通过对比新旧 Virtual DOM（Diff）计算出最小变更，然后批量更新真实 DOM，减少直接操作 DOM 的开销。

Diff 算法（React 16 前）：
• 只进行同层比较，不跨层级比较
• 不同类型的元素直接卸载重建
• 同一类型的元素比较属性，更新变化的属性
• 子元素通过 key 来识别，key 相同则复用，不同则重排/新建

React Fiber（React 16+）：
• 将渲染工作拆分为小单元（fiber），可中断和恢复
• 引入优先级调度，高优先级更新（如用户输入）可打断低优先级更新
• 两阶段：render 阶段（可中断）和 commit 阶段（同步执行）`,
        tags: ['核心', '原理'],
      },
      {
        id: 'react-state',
        question: 'React 状态管理方案有哪些？如何选择？',
        answer: `组件级状态：
• useState / useReducer：适合局部、简单状态
• useContext + useReducer：适合跨组件共享，但频繁更新时性能差

全局状态管理：
• Redux：生态完善、可预测、有 Redux DevTools，但模板代码多
• Zustand：轻量、简洁、无 Provider 包裹，现代项目首选
• Jotai / Recoil：原子化状态管理，适合细粒度状态
• MobX：响应式编程，自动追踪依赖

选择建议：
• 小型项目 / 局部状态：useState + Context
• 中大型项目：Zustand（简洁）或 Redux Toolkit（规范）
• 需要细粒度订阅：Jotai / Recoil`,
        tags: ['架构', '状态管理'],
      },
      {
        id: 'react-performance',
        question: 'React 性能优化手段有哪些？',
        answer: `• React.memo：包裹函数组件，进行 props 浅比较
• useMemo：缓存昂贵计算的结果
• useCallback：缓存函数引用，避免子组件不必要的重渲染
• 合理使用 key：帮助 React 识别元素，减少不必要的 DOM 操作
• 懒加载：React.lazy + Suspense 按需加载组件
• 虚拟列表：react-window / react-virtualized 只渲染可视区域
• 避免在 render 中创建新对象/函数（使用 useMemo/useCallback）
• 使用 Production 构建（关闭开发模式警告和检查）
• useTransition / useDeferredValue（React 18）：标记非紧急更新，避免阻塞 UI`,
        tags: ['性能', '高频面试'],
      },
      {
        id: 'react-fiber',
        question: 'React Fiber 架构是什么？',
        answer: `Fiber 是 React 16 引入的新协调引擎（Reconciler），核心目标是：
• 将渲染工作拆分为可中断的小单元
• 实现优先级调度
• 支持并发特性（Concurrent Features）

Fiber 节点结构：
• 每个 React 元素对应一个 Fiber 节点
• 通过 child、sibling、return（parent）指针形成链表树
• 替代了之前的递归栈结构

两阶段提交：
1. Render 阶段（可中断）：构建 Fiber 树，计算变更，可被打断
2. Commit 阶段（不可中断）：同步执行 DOM 更新和副作用

带来的新特性：
• Suspense：异步组件加载
• Concurrent Mode：并发渲染
• useTransition / useDeferredValue：非紧急更新`,
        tags: ['原理', '进阶'],
      },
    ],
  },
  {
    id: 'vue',
    name: 'Vue',
    items: [
      {
        id: 'vue-reactive',
        question: 'Vue 2 和 Vue 3 的响应式原理有什么区别？',
        answer: `Vue 2：
• 使用 Object.defineProperty 劫持对象属性的 getter 和 setter
• 缺点：无法检测新增/删除属性（需用 Vue.set / Vue.delete），无法检测数组索引和 length 变化

Vue 3：
• 使用 Proxy 代理整个对象
• 优点：可检测新增/删除属性、数组索引变化、Map/Set 等
• 性能更好，初始化时不需要递归遍历所有属性

Vue 3 的 reactivity 系统：
• ref：包装基本类型为响应式对象（.value 访问）
• reactive：包装对象为响应式 Proxy
• computed：计算属性，缓存结果
• watch / watchEffect：侦听器`,
        tags: ['原理', '核心'],
      },
      {
        id: 'vue-lifecycle',
        question: 'Vue 3 的生命周期有哪些变化？',
        answer: `Options API 变化：
• beforeDestroy → beforeUnmount
• destroyed → unmounted
• 其他钩子名保持不变

Composition API 新钩子：
• setup()：组件入口，替代 beforeCreate 和 created
• onBeforeMount / onMounted
• onBeforeUpdate / onUpdated
• onBeforeUnmount / onUnmounted
• onErrorCaptured
• onRenderTracked / onRenderTriggered（调试用）

注意：Composition API 中没有 beforeCreate 和 created，setup 本身就在这两个阶段之间执行。`,
        tags: ['基础', 'Composition API'],
      },
      {
        id: 'vue-composition',
        question: 'Composition API 相比 Options API 的优势？',
        answer: `• 逻辑复用：通过组合函数（Composables）复用逻辑，替代 mixin
• 逻辑聚合：同一功能的代码（state + methods + computed + watch）写在一起，不再分散在 options 中
• TypeScript 支持更好：函数式 API 类型推断更自然
•  tree-shaking：未使用的逻辑更容易被移除
• 更灵活：可按需引入响应式 API

使用 setup 语法糖（<script setup>）后，代码更简洁，自动暴露变量到模板。`,
        tags: ['Vue3', '架构'],
      },
      {
        id: 'vue-diff',
        question: 'Vue 的 Diff 算法与 React 有什么不同？',
        answer: `相同点：
• 都是同层比较
• 都用 key 来标识节点身份

Vue 2 Diff（双端比较）：
• 对新旧子节点列表进行头尾交叉比较（4 种情况：旧头新头、旧尾新尾、旧头新尾、旧尾新头）
• 如果都不匹配，则通过 key 查找可复用节点
• 时间复杂度 O(n)，比 React 的 O(n) 策略更高效（实际对比中通常更优）

Vue 3 Diff（快速 Diff）：
• 借鉴了文本 diff 算法，先处理前后不变的节点（预处理）
• 中间部分使用最长递增子序列（LIS）计算最少移动次数
• 性能更优，移动操作更少`,
        tags: ['原理', '进阶'],
      },
    ],
  },
  {
    id: 'browser',
    name: '浏览器',
    items: [
      {
        id: 'browser-render',
        question: '浏览器渲染页面的过程是什么？',
        answer: `1. 解析 HTML 生成 DOM 树
2. 解析 CSS 生成 CSSOM 树
3. DOM + CSSOM 合并为 Render Tree（只包含可见元素）
4. Layout（Reflow）：计算每个元素的位置和大小
5. Paint：将像素绘制到屏幕上
6. Composite：合成图层，将多个图层合并显示

关键概念：
• CSS 会阻塞 DOM 解析（因为需要 CSSOM 才能构建 Render Tree）
• JS 会阻塞 DOM 解析（因为 JS 可能修改 DOM 和 CSSOM）
• 优化手段：CSS 放头部、JS 放底部或使用 defer/async、减少重绘回流`,
        tags: ['原理', '渲染'],
      },
      {
        id: 'browser-storage',
        question: '浏览器的存储方案有哪些？区别是什么？',
        answer: `• Cookie：4KB 左右，可设置过期时间，每次请求自动携带（影响性能），可设置 HttpOnly / Secure / SameSite
• localStorage：5-10MB，持久存储，只能存字符串，同步操作，同源共享
• sessionStorage：同 localStorage，但页面关闭即清除
• IndexedDB：结构化数据库，支持索引和事务，容量大（通常 50MB+），异步 API
• Cache API：配合 Service Worker 实现离线缓存（PWA）

选择建议：
• 身份凭证：Cookie（HttpOnly）
• 用户偏好设置：localStorage
• 大量结构化数据：IndexedDB
• 离线缓存：Cache API + Service Worker`,
        tags: ['基础', '存储'],
      },
      {
        id: 'browser-cors',
        question: '什么是跨域？如何解决？',
        answer: `跨域（CORS）：浏览器同源策略（协议+域名+端口相同）限制下，不同源的请求被阻止。

解决方案：
• CORS（服务端设置响应头）：Access-Control-Allow-Origin 等
• 代理服务器：开发环境用 webpack/vite 代理，生产环境用 Nginx 反向代理
• JSONP：利用 <script> 标签不受同源策略限制（只支持 GET，已过时）
• postMessage：不同窗口/iframe 间通信
• WebSocket：不受同源策略限制
• 服务端中转：后端请求第三方 API 再返回给前端

预检请求（Preflight）：
• 非简单请求（如自定义头、PUT/DELETE、Content-Type: application/json）会先发送 OPTIONS 请求询问服务器是否允许。`,
        tags: ['网络', '安全'],
      },
      {
        id: 'browser-xss-csrf',
        question: 'XSS 和 CSRF 是什么？如何防御？',
        answer: `XSS（跨站脚本攻击）：攻击者注入恶意脚本到网页中，用户浏览时执行。
类型：存储型（存入数据库）、反射型（URL 参数）、DOM 型（前端 JS 操作）
防御：
• 输入过滤和输出编码（innerHTML → textContent，使用 DOMPurify）
• CSP（Content Security Policy）限制脚本来源
• HttpOnly Cookie（防止 JS 读取 Cookie）

CSRF（跨站请求伪造）：攻击者诱导用户在已登录的网站上执行非自愿的操作。
防御：
• CSRF Token：服务端生成随机 Token，请求时验证
• SameSite Cookie：设置 Cookie 的 SameSite 属性为 Strict 或 Lax
• 验证 Referer / Origin 头
• 关键操作使用二次确认（验证码、密码确认）`,
        tags: ['安全', '高频面试'],
      },
    ],
  },
  {
    id: 'network',
    name: '网络 / HTTP',
    items: [
      {
        id: 'http-status',
        question: '常见的 HTTP 状态码有哪些？',
        answer: `1xx 信息：
• 100 Continue：继续发送请求体

2xx 成功：
• 200 OK：请求成功
• 201 Created：资源创建成功
• 204 No Content：成功但无返回内容

3xx 重定向：
• 301 Moved Permanently：永久重定向
• 302 Found：临时重定向
• 304 Not Modified：缓存有效，使用缓存

4xx 客户端错误：
• 400 Bad Request：请求参数错误
• 401 Unauthorized：未认证
• 403 Forbidden：无权限
• 404 Not Found：资源不存在
• 429 Too Many Requests：请求过多

5xx 服务端错误：
• 500 Internal Server Error：服务器内部错误
• 502 Bad Gateway：网关错误
• 503 Service Unavailable：服务不可用`,
        tags: ['基础', '网络'],
      },
      {
        id: 'http-versions',
        question: 'HTTP/1.1、HTTP/2、HTTP/3 有什么区别？',
        answer: `HTTP/1.1：
• 持久连接（Keep-Alive）
• 管道化（Pipelining，存在队头阻塞问题）
• 请求头冗余（每次请求都带完整头部）
• 文本协议

HTTP/2：
• 二进制分帧（Binary Framing）
• 多路复用（Multiplexing）：一个 TCP 连接上并发多个请求，解决队头阻塞
• 头部压缩（HPACK）
• 服务端推送（Server Push）
• 仍基于 TCP，存在 TCP 队头阻塞

HTTP/3：
• 基于 QUIC 协议（UDP 之上）
• 彻底解决队头阻塞（QUIC 在传输层实现多路复用）
• 连接迁移（IP 变化不影响连接）
• 内置 TLS 1.3，握手更快
• 0-RTT 或 1-RTT 建立连接`,
        tags: ['进阶', '网络'],
      },
      {
        id: 'tcp-handshake',
        question: 'TCP 三次握手和四次挥手的过程？',
        answer: `三次握手（建立连接）：
1. SYN：客户端发送 SYN=1, seq=x 到服务端
2. SYN+ACK：服务端回复 SYN=1, ACK=1, seq=y, ack=x+1
3. ACK：客户端回复 ACK=1, seq=x+1, ack=y+1

为什么是三次？防止历史重复连接初始化，同步双方初始序列号。

四次挥手（断开连接）：
1. FIN：主动方发送 FIN=1, seq=u
2. ACK：被动方回复 ACK=1, ack=u+1
3. FIN：被动方发送完数据后发送 FIN=1, seq=w
4. ACK：主动方回复 ACK=1, ack=w+1，进入 TIME_WAIT 状态

TIME_WAIT 作用：确保最后的 ACK 能被对方收到，防止旧连接的延迟数据包影响新连接。`,
        tags: ['基础', '网络'],
      },
      {
        id: 'https',
        question: 'HTTPS 的工作原理？',
        answer: `HTTPS = HTTP + SSL/TLS，在 HTTP 之下加入加密层。

TLS 握手过程（TLS 1.2）：
1. Client Hello：客户端发送支持的加密套件、随机数（Client Random）
2. Server Hello：服务端选择加密套件，发送证书和随机数（Server Random）
3. 客户端验证证书（CA 签名、有效期、域名匹配）
4. 客户端生成 Pre-Master Secret，用服务端公钥加密后发送
5. 双方用 Client Random + Server Random + Pre-Master Secret 生成会话密钥
6. 之后的数据用对称加密（会话密钥）传输

TLS 1.3 改进：
• 握手流程简化到 1-RTT（甚至 0-RTT）
• 移除不安全的加密算法
• 前向安全性更好`,
        tags: ['安全', '网络'],
      },
      {
        id: 'http-cache',
        question: 'HTTP 缓存策略有哪些？',
        answer: `强制缓存（不请求服务器）：
• Expires：过期时间（HTTP/1.0，绝对时间，受本地时间影响）
• Cache-Control：max-age=秒（HTTP/1.1，相对时间，优先级更高）
• 状态码 200 (from cache) / 200 (from disk cache) / 200 (from memory cache)

协商缓存（请求服务器确认）：
• Last-Modified + If-Modified-Since：比较文件修改时间（秒级精度，可能不准）
• ETag + If-None-Match：比较文件内容哈希（优先级更高，更精确）
• 未变更返回 304 Not Modified

Cache-Control 常用值：
• no-cache：使用协商缓存（每次都要验证）
• no-store：完全不缓存
• private：仅浏览器缓存
• public：浏览器和 CDN 都可缓存
• max-age=秒：强制缓存时长`,
        tags: ['性能', '网络'],
      },
    ],
  },
  {
    id: 'performance',
    name: '性能优化',
    items: [
      {
        id: 'perf-loading',
        question: '前端加载性能优化有哪些手段？',
        answer: `• 代码分割：路由懒加载（React.lazy / Vue Router 的 component: () => import()）
• 资源压缩：Gzip/Brotli 压缩、代码压缩（Terser）、图片压缩（WebP/AVIF）
• 缓存策略：合理的 HTTP 缓存、Service Worker 缓存
• CDN：静态资源分发到边缘节点
• 预加载：preload（当前页面关键资源）、prefetch（未来可能需要的资源）
• DNS 预解析：dns-prefetch、preconnect
• 减少 HTTP 请求：雪碧图（已过时）、字体子集化、内联小资源
• Tree Shaking：移除未使用的代码
• 第三方库优化：按需加载（lodash-es）、替换为轻量库`,
        tags: ['性能', '加载优化'],
      },
      {
        id: 'perf-runtime',
        question: '前端运行时性能优化有哪些手段？',
        answer: `• 减少重绘回流：批量修改样式、使用 transform/opacity 动画
• 虚拟列表：只渲染可视区域（react-window、vue-virtual-scroller）
• 防抖节流：控制高频事件触发频率
• Web Worker：把计算密集型任务移到后台线程
• 图片懒加载：Intersection Observer + loading="lazy"
• 骨架屏 / 占位图：减少白屏时间，提升感知性能
• 长任务拆分：使用 requestIdleCallback 或 setTimeout 拆分长任务
• 内存管理：及时清理事件监听、定时器、大数据引用
• requestAnimationFrame：平滑动画，与浏览器刷新率同步`,
        tags: ['性能', '运行时'],
      },
      {
        id: 'core-web-vitals',
        question: 'Core Web Vitals 是什么？',
        answer: `Google 提出的三个核心网页指标，用于衡量用户体验：

• LCP（Largest Contentful Paint）：最大内容绘制时间
  目标：< 2.5s（衡量加载性能）

• FID（First Input Delay）→ 已替换为 INP（Interaction to Next Paint）
  INP：交互到下一帧绘制的时间
  目标：< 200ms（衡量交互响应性）

• CLS（Cumulative Layout Shift）：累积布局偏移
  目标：< 0.1（衡量视觉稳定性）

其他重要指标：
• FCP（First Contentful Paint）：首次内容绘制
• TTFB（Time to First Byte）：首字节时间
• TBT（Total Blocking Time）：总阻塞时间`,
        tags: ['性能', '指标'],
      },
    ],
  },
  {
    id: 'engineering',
    name: '工程化',
    items: [
      {
        id: 'webpack-vite',
        question: 'Webpack 和 Vite 的区别？',
        answer: `Webpack：
• 基于打包（Bundle-based）：开发时也需要打包整个应用
• 启动慢，热更新慢（项目越大越明显）
• 生态成熟，配置灵活，Loader 和 Plugin 丰富
• 支持代码分割、Tree Shaking、资源处理

Vite：
• 基于原生 ESM：开发时无需打包，浏览器直接请求模块
• 启动极快（秒级），热更新快（只更新变更模块）
• 使用 esbuild（Go 编写）进行预构建依赖
• 生产环境使用 Rollup 打包
• 配置更简单，开箱即用体验好

选择建议：
• 新项目 / 中小型项目：Vite
• 需要复杂自定义构建逻辑：Webpack
• 大型项目迁移成本高，可继续使用 Webpack`,
        tags: ['构建工具', '工程化'],
      },
      {
        id: 'babel',
        question: 'Babel 的作用是什么？',
        answer: `Babel 是 JavaScript 编译器，主要作用：
• 语法转换：将 ES6+ / TypeScript / JSX 转换为兼容的 JavaScript
• Polyfill 注入：通过 @babel/preset-env 和 core-js 注入缺失的特性
• JSX 转换：将 JSX 转为 React.createElement
• 代码优化：如常量折叠、死代码消除等

配置关键：
• presets：预设（如 @babel/preset-env, @babel/preset-react, @babel/preset-typescript）
• plugins：插件（如 @babel/plugin-proposal-decorators）
• .browserslistrc：指定目标浏览器范围，决定转换程度`,
        tags: ['构建工具', '基础'],
      },
      {
        id: 'ci-cd',
        question: '前端 CI/CD 流程一般包含哪些步骤？',
        answer: `持续集成（CI）：
• 代码提交触发自动化构建
• 代码规范检查（ESLint / Prettier）
• 单元测试 / 集成测试运行
• 构建产物生成

持续部署（CD）：
• 构建产物自动部署到测试/预发布/生产环境
• 自动化回归测试
• 灰度发布 / 金丝雀发布
• 监控和回滚机制

常用工具：
• GitHub Actions / GitLab CI / Jenkins
• Docker 容器化部署
• Nginx / CDN 分发
• Sentry / 阿里云 ARMS 监控报错`,
        tags: ['DevOps', '工程化'],
      },
      {
        id: 'monorepo',
        question: '什么是 Monorepo？常用工具？',
        answer: `Monorepo：在一个代码仓库中管理多个项目/包。

优势：
• 代码共享和复用容易
• 统一构建、测试、发布流程
• 跨项目重构方便（一个 PR 修改多个包）
• 依赖管理集中

挑战：
• 仓库体积大
• 构建时间长（可用增量构建解决）
• 权限管理复杂

常用工具：
• pnpm workspaces：轻量，依赖去重做得好
• Nx：企业级，强大的缓存和任务编排
• Turborepo：Vercel 出品，远程缓存，适合前端
• Lerna + yarn workspaces：经典组合，现多被 pnpm + Turborepo 替代`,
        tags: ['架构', '工程化'],
      },
    ],
  },
  {
    id: 'algorithm',
    name: '算法',
    items: [
      {
        id: 'sort-algo',
        question: '常见排序算法的时间复杂度？',
        answer: `• 冒泡排序：O(n²)，稳定，原地
• 选择排序：O(n²)，不稳定，原地
• 插入排序：O(n²)，稳定，原地，对小数组高效
• 归并排序：O(n log n)，稳定，需要 O(n) 额外空间
• 快速排序：O(n log n) 平均，O(n²) 最坏，不稳定，原地
• 堆排序：O(n log n)，不稳定，原地
• 计数排序：O(n + k)，稳定，非比较排序，适合范围小的整数

JavaScript 的 Array.prototype.sort()：
• V8 引擎：小数组用插入排序，大数组用快速排序（Timsort 在较新版本）
• 不是稳定排序（ES2019 后要求稳定）`,
        tags: ['基础', '算法'],
      },
      {
        id: 'binary-search',
        question: '二分查找的原理和时间复杂度？',
        answer: `原理：在有序数组中，每次取中间元素与目标比较，排除一半元素，直到找到目标或范围为空。

时间复杂度：O(log n)
空间复杂度：O(1)（迭代）或 O(log n)（递归）

适用场景：
• 有序数组查找
• 查找第一个/最后一个满足条件的元素（边界二分）
• 答案具有单调性的问题（最小化最大值等）

注意：
• 必须处理整数溢出的问题（mid = left + Math.floor((right - left) / 2)）
• 边界条件（left <= right 还是 left < right）`,
        tags: ['基础', '算法'],
      },
      {
        id: 'linked-list',
        question: '链表常见操作和技巧？',
        answer: `常见操作：
• 反转链表（迭代 / 递归）
• 快慢指针：找中点、检测环（Floyd 判圈算法）、找环入口
• 合并两个有序链表
• 删除倒数第 N 个节点（双指针）
• 相交链表（双指针追及）

技巧：
• 虚拟头节点（dummy node）：简化头节点操作
• 画图辅助思考指针走向
• 注意空指针和只有一个节点的情况`,
        tags: ['数据结构', '算法'],
      },
      {
        id: 'tree-algo',
        question: '二叉树的常见遍历方式？',
        answer: `深度优先（DFS）：
• 前序遍历：根 → 左 → 右
• 中序遍历：左 → 根 → 右（BST 中序得到有序序列）
• 后序遍历：左 → 右 → 根
• 实现：递归（简洁）或栈（迭代）

广度优先（BFS）：
• 层序遍历：从上到下，从左到右
• 实现：队列

常见题型：
• 最大/最小深度
• 路径和
• 对称二叉树
• 最近公共祖先（LCA）
• 序列化与反序列化`,
        tags: ['数据结构', '算法'],
      },
    ],
  },
]
export default interviewData
