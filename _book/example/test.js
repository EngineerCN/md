const safeStringify = require("safe-json-stringify")

var obj = {
    name: "A"
};

const createObj = () => {
    obj["obj"] = obj
    return obj
}

console.log(safeStringify(createObj()))



var obj = {};
obj.__defineGetter__('foo', function () { throw new Error('ouch!'); });

console.log(safeStringify(obj)); // {"foo":"[Throws: ouch!]"}


var obj = {
    name: "A",
    toJSON: () => {
        throw new Error('Failing');
    }
};
console.log(safeStringify(obj)); // 

