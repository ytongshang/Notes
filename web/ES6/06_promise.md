# Promise

-   类似于 Java 中的 Future
-   两个特点
    -   **对象的状态不受外界影响**。Promise 对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）和 rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态
    -   **一旦状态改变，就不会再变，任何时候都可以得到这个结果**。Promise 对象的状态改变，只有两种可能：从 pending 变为 fulfilled 和从 pending 变为 rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。**如果改变已经发生了，你再对 Promise 对象添加回调函数，也会立即得到这个结果**

## 基本用法

-   **resolve**函数的作用是，将 Promise 对象的状态从“未完成”变为“成功”（即从 pending 变为 resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去
-   **reject**函数的作用是，将 Promise 对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去
-   Promise 实例生成以后，可以用 then 方法分别指定 resolved 状态和 rejected 状态的回调函数

```js
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});

promise.then(function(value) {
  // success
}, function(error) {
  // failure
});
```

```js
// 异步加载图片
function loadImageAsync(url) {
    return new Promise((reslove, reject) => {
        let image = new Image();
        image.onload = () => {
            reslove(image);
        };
        image.onerror = () => {
            reject(new Error('load image failed' + url));
        };

        image.src = url;
    });
}
```

```js
const getJson = function(url) {
    return new Promise((reslove, reject) => {
        const handler = function() {
            if (this.readyState != 4) {
                return;
            }
            if (this.status == 200) {
                reslove(this.response);
            } else {
                reject(new Error(this.statusText));
            }
        };
        const client = new XMLHttpRequest();
        client.open('GET', url);
        client.onreadystatechange = handler;
        client.responseType = 'json';
        client.setRequestHeader('Accept', 'application/json');
        client.send();
    });
};
```

-   如果调用 resolve 函数和 reject 函数时带有参数，那么它们的参数会被传递给回调函数。reject 函数的参数通常是 Error 对象的实例，表示抛出的错误；**resolve 函数的参数除了正常的值以外，还可能是另一个 Promise 实例**

```js
const p1 = new Promise(function(resolve, reject) {
    setTimeout(() => reject(new Error('fail')), 3000);
});

const p2 = new Promise(function(resolve, reject) {
    setTimeout(() => resolve(p1), 1000);
});

// p2 1秒后变成resloved返回p1,
//由于p1也是一个promise,p2的状态无效，由p1的状态决定p2的状态
//如果p1的状态已经是resolved或者rejected，那么p2的回调函数将会立刻执行
p2.then(result => console.log(result)).catch(error => console.log(error));
// Error: fail
```

-   **调用 resolve 或 reject 并不会终结 Promise 的参数函数的执行**

```js
new Promise((resolve, reject) => {
    resolve(1);
    console.log(2);
}).then(r => {
    console.log(r);
});
// 2
// 1
```

## Promise.prototype.then()

-   **then 方法返回的是一个新的 Promise 实例（注意，不是原来那个 Promise 实例）**。因此可以采用链式写法，即 then 方法后面再调用另一个 then 方法

```js
getJson('/post/1.json')
    .then(function(post) {
        return getJson(post.commentURL);
    })
    .then(
        function(comments) {
            console.log('resloved:' + comments);
        },
        function(err) {
            console.log('rejected:' + err);
        }
    );
```

## Promise.prototype.catch()

-   **Promise.prototype.catch 方法是.then(null, rejection)或.then(undefined, rejection)的别名**，用于指定发生错误时的回调函数

```js
p.then(val => console.log('fulfilled:', val)).catch(err =>
    console.log('rejected', err)
);

// 等同于
p.then(val => console.log('fulfilled:', val)).then(null, err =>
    console.log('rejected:', err)
);
```

-   无论 Promise 的构造函数，还是 then 中指定的回调函数出现错误，都会被 catch，catch 住
-   **reject 方法的作用，等同于抛出错误**
-   **如果 Promise 状态已经变成 resolved，再抛出错误是无效的**

```js
// 下面三种写法相同
// Promise内部的exception会被catch catch住的
const promise = new Promise(function(resolve, reject) {
    throw new Error('test');
});
promise.catch(function(error) {
    console.log(error);
});
// Error: test

// 写法一
const promise = new Promise(function(resolve, reject) {
    try {
        throw new Error('test');
    } catch (e) {
        reject(e);
    }
});
promise.catch(function(error) {
    console.log(error);
});

// 写法二
const promise = new Promise(function(resolve, reject) {
    reject(new Error('test'));
});
promise.catch(function(error) {
    console.log(error);
});
```

```js
const promise = new Promise(function(resolve, reject) {
    resolve('ok');
    // 已经变成resloved状态，再抛出错误是无效的
    throw new Error('test');
});
promise
    .then(function(value) {
        console.log(value);
    })
    .catch(function(error) {
        console.log(error);
    });
// ok
```

-   **Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止**。也就是说，错误总是会被下一个 catch 语句捕获
-   **因此一般不要在 then 方法里面定义 Reject 状态的回调函数（即 then 的第二个参数），总是使用 catch 方法**

```js
getJSON('/post/1.json')
    .then(function(post) {
        return getJSON(post.commentURL);
    })
    .then(function(comments) {
        // some code
    })
    .catch(function(error) {
        // 处理前面三个Promise产生的错误
    });
```

-   **跟传统的 try/catch 代码块不同的是，如果没有使用 catch 方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码，即不会有任何反应**

```js
const someAsyncThing = function() {
    return new Promise(function(resolve, reject) {
        // 下面一行会报错，因为x没有声明
        resolve(x + 2);
    });
};

someAsyncThing().then(function() {
    console.log('everything is great');
});

setTimeout(() => {
    console.log(123);
}, 2000);
// Uncaught (in promise) ReferenceError: x is not defined
// 123
// 浏览器运行到这一行，会打印出错误提示ReferenceError: x is not defined，但是不会退出进程、终止脚本执行，2 秒之后还是会输出123。这就是说，Promise 内部的错误不会影响到 Promise 外部的代码，通俗的说法就是“Promise 会吃掉错误”
```

-   一般总是建议，Promise 对象后面要跟 catch 方法，这样可以处理 Promise 内部发生的错误。**catch 方法返回的还是一个 Promise 对象，因此后面还可以接着调用 then 方法**

```js
const someAsyncThing = function() {
    return new Promise(function(resolve, reject) {
        // 下面一行会报错，因为x没有声明
        resolve(x + 2);
    });
};

// 运行完catch方法指定的回调函数，会接着运行后面那个then方法指定的回调函数
someAsyncThing()
    .catch(function(error) {
        console.log('oh no', error);
    })
    .then(function() {
        console.log('carry on');
    });
// oh no [ReferenceError: x is not defined]
// carry on
```

```js
// 如果没有报错，则会跳过catch方法
Promise.resolve()
    .catch(function(error) {
        console.log('oh no', error);
    })
    .then(function() {
        console.log('carry on');
    });
// carry on
```

```js
const someAsyncThing = function() {
    return new Promise(function(resolve, reject) {
        // 下面一行会报错，因为x没有声明
        resolve(x + 2);
    });
};

someAsyncThing()
    .then(function() {
        return someOtherAsyncThing();
    })
    .catch(function(error) {
        console.log('oh no', error);
        // 下面一行会报错，因为 y 没有声明
        y + 2;
    })
    // catch抛出一个错误，因为后面没有别的catch方法了，导致这个错误不会被捕获，也不会传递到外层
    .then(function() {
        console.log('carry on');
    });
// oh no [ReferenceError: x is not defined]
```

```js
someAsyncThing()
    .then(function() {
        return someOtherAsyncThing();
    })
    // 这个catch只会catch前面出的错，后面出的错不会catch住的
    .catch(function(error) {
        console.log('oh no', error);
        // 下面一行会报错，因为y没有声明
        y + 2;
    })
    //  catch住上一个catch之后出现的错误
    .catch(function(error) {
        console.log('carry on', error);
    });
// oh no [ReferenceError: x is not defined]
// carry on [ReferenceError: y is not defined]
```

## Promise.prototype.finally()

-   **finally 方法用于指定不管 Promise 对象最后状态如何，都会执行的操作**
-   finally 方法的回调函数不接受任何参数，这意味着没有办法知道，前面的 Promise 状态到底是 fulfilled 还是 rejected。这表明，**finally 方法里面的操作，应该是与状态无关的，不依赖于 Promise 的执行结果**

```js
// 不管promise最后的状态，在执行完then或catch指定的回调函数以后，都会执行finally方法指定的回调函数
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```

-   finally 实际上是 then 的特例

```js
promise.finally(() => {
    // 语句
});

// 等同于
promise.then(
    result => {
        // 语句
        return result;
    },
    error => {
        // 语句
        throw error;
    }
);
```

-   finally 总是返回原来的值

```js
// resolve 的值是 undefined
Promise.resolve(2).then(() => {}, () => {});

// resolve 的值是 2
Promise.resolve(2).finally(() => {});

// reject 的值是 undefined
Promise.reject(3).then(() => {}, () => {});

// reject 的值是 3
Promise.reject(3).finally(() => {});
```

## 其它

### Promise.all()

-   Promise.all 方法用于将多个 Promise 实例，包装成一个新的 Promise 实例
-   **Promise.all 方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例**
-   Promise 的状态

    -   只有 p1、p2、p3 的状态都变成 fulfilled，p 的状态才会变成 fulfilled，此时 p1、p2、p3 的返回值组成一个数组，传递给 p 的回调函数。

    -   只要 p1、p2、p3 之中有一个被 rejected，p 的状态就变成 rejected，此时第一个被 reject 的实例的返回值，会传递给 p 的回调函数。

```js
const p = Promise.all([p1, p2, p3]);
```

### Promise.race()

-   只要 p1、p2、p3 之中有一个实例率先改变状态，p 的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给 p 的回调函数

```js
const p = Promise.race([p1, p2, p3]);
```

### Promise.resolve()

-   有时需要将现有对象转为 Promise 对象，Promise.resolve 方法就起到这个作用

```js
const jsPromise = Promise.resolve($.ajax('/whatever.json'));
```

### Promise.reject()

-   Promise.reject(reason)方法也会返回一个新的 Promise 实例，该实例的状态为 rejected

```js
const p = Promise.reject('出错了');
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'));

p.then(null, function(s) {
    console.log(s);
});
// 出错了
```
