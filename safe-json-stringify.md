> 分享者 : KEN
> 日期:2020/9/12
> 邮箱 : 919125189@qq.com

# 包地址

https://www.npmjs.com/package/safe-json-stringify

https://github.com/debitoor/safe-json-stringify

# 包作用

填补 JSON.stringify 不足

# JSON.stringify 使用介绍

### [MDN 文档关于 JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#toJSON_behavior)

### JSON.stringify 问题

```
var obj = {
    name:"A",
    toJSON:()=>{
        throw new Error('Failing');
    }
};

JSON.stringify(obj); // error thrown
```

```
var obj = {};
obj.__defineGetter__('foo', function() { throw new Error('ouch!'); });

JSON.stringify(obj); // error thrown
```

```
var obj = {
    name: "A"
};

const createObj = () => {
    obj["obj"] = obj
    return obj
}

JSON.stringify(createObj()) // error thrown
```

### safe-json-stringify 解决问题

```
const safeStringify = require("safe-json-stringify")
var obj = {
    name:"A",
    toJSON:()=>{
        throw new Error('Failing');
    }
};
console.log(safeStringify(obj)); // "[Throws: Failing]"

```

```
const safeStringify = require("safe-json-stringify")
var obj = {};
obj.__defineGetter__('foo', function () { throw new Error('ouch!'); });

console.log(safeStringify(obj)); // {"foo":"[Throws: ouch!]"}
```

```
var obj = {
    name: "A"
};

const createObj = () => {
    obj["obj"] = obj
    return obj
}

safeStringify(obj); // {"name":"A","obj":"[Circular]"}
```

# safe-json-stringify 代码阅读

```
// 引入Object判断自身Property方法
var hasProp = Object.prototype.hasOwnProperty;

// 处理Error Thrown
function throwsMessage(err) {
	return '[Throws: ' + (err ? err.message : '?') + ']';
}
// 获取属性值
function safeGetValueFromPropertyOnObject(obj, property) {
    // 先调用抓出 error thrown
	if (hasProp.call(obj, property)) {
		try {
			return obj[property];
		}
		catch (err) {
			return throwsMessage(err);
		}
	}

	return obj[property];
}
// 序列化主方法
function ensureProperties(obj) {
    // 用来记录递归中对象
	var seen = [ ]; // store references to objects we have seen before

    // 便于递归序列化
	function visit(obj) {
        // 递归到底处理
		if (obj === null || typeof obj !== 'object') {
			return obj;
		}
		if (seen.indexOf(obj) !== -1) {
			return '[Circular]';
		}

		// 递归没有到底处理
		seen.push(obj);      // 入栈


		if (typeof obj.toJSON === 'function') {
			try {
				var fResult = visit(obj.toJSON());
				seen.pop();
				return fResult;
			} catch(err) {
				return throwsMessage(err);
			}
		}

		if (Array.isArray(obj)) {
			var aResult = obj.map(visit);
			seen.pop();
			return aResult;
		}

		var result = Object.keys(obj).reduce(function(result, prop) {
			// prevent faulty defined getter properties
			result[prop] = visit(safeGetValueFromPropertyOnObject(obj, prop));
			return result;
		}, {});
		seen.pop();          // 出栈
		return result;
	};

	return visit(obj);
}

// 兼容JSON.stringify序列化
module.exports = function(data, replacer, space) {
	return JSON.stringify(ensureProperties(data), replacer, space);
}
// 单纯序列化
module.exports.ensureProperties = ensureProperties;

```
