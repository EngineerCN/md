const safeStringify = require("safe-json-stringify")

/**
 * Circular
 */
// var obj = {
//     name: "A"
// };

// const createObj = () => {
//     obj["obj"] = obj
//     return obj
// }

// console.log(safeStringify(createObj()))

/**
 * err thrown
 */

// var obj = {};
// obj.__defineGetter__('foo', function () { throw new Error('ouch!'); });

// console.log(safeStringify(obj)); // {"foo":"[Throws: ouch!]"}

/**
 * toJSON
 */
// var obj = {
//     name: "cjl",
//     age: 18,
//     toJSON: () => {
//         return "ljc"
//     }
// }
// console.log(JSON.stringify(obj));

// var obj = {
//     name: "A",
//     toJSON: () => {
//         throw new Error('Failing');
//     }
// };
// console.log(safeStringify(obj));   //{"name":"A","obj":"[Circular]"}

/**
 * about call
 */
// const obj = {
//     name: "cjl"
// }

// haspro = Object.prototype.hasOwnProperty

// console.log(haspro.call(obj, "name"))


// const arr = ["1", "2", "3"]

// Array.prototype.forEach.call(arr, (idx, item) => {
//     console.log(`idx : ${item}`);
// })

/**
 * call & apply
 */
// const arr = ["1", "2", "3"]
// fn = (arg1, arg2) => {
//     console.log(`arg1:${arg1},arg2:${arg2}`)
//     return "ok"
// }

// console.log(fn.call(arr, "A", "B"))
// console.log(fn.apply(arr, ["A", "B"]))


/**
 * reduce
 */
// const arr = ["1", "2", "3"]
// const res = arr.reduce((res, prop) => {
//     // console.log(res);
//     // console.log(prop);
//     return res + parseInt(prop)
// }, 0)
// console.log(res);

/**
 * map
 */

// const arr = ["1", "2", "3"]
// arr.map((v, idx, arr) => {
//     console.log(`${idx}:${v}`);

// })


/**
 * simple stringify demo
 */

const stringify = function (obj) {

    const seen = []

    const visit = (obj) => {
        obj["flag"] = true

        if (obj === null || typeof obj !== 'object') {
            return obj
        }

        seen.push(obj)
        const result = Array.prototype.reduce.call(Object.keys(obj), (pre, cur, idx) => {
            pre[cur] = visit(obj[cur])
            return pre
        }, {})
        // const result = Array.prototype.reduce.apply(Object.keys(obj), [(pre, cur, idx) => {
        //     return pre
        // }, {}])
        seen.pop()
        return result
    }
    return visit(obj)
}

const obj = {
    name: "cjl",
    age: 18,
    child: {
        name: 'selina',
        age: 9
    }
}
console.log(stringify(obj));


