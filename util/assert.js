/**
 * Assert 
 */
function assert(condition, message) {
    // just like console.assert
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}

function checkClass(instance, match) {
    return Object.prototype.toString.call(instance).match(match);
}

function checkTypeStrict(instance, name) {
    return Object.prototype.toString.call(instance) === `[object ${name}]`;
}

function getNativeType(instance) {
    // [object ***]
    let typestr = Object.prototype.toString.call(instance);
    assert(typestr.startsWith('[object ') && typestr.endsWith(']'), 'not a native type');
    return typestr.substring(8, typestr.length - 1);
}

function isArray(arr) {
    return checkClass(arr, 'Array') && typeof arr.length === 'number' && arr.length === Math.floor(arr.length);
}

/**
 * Check if the first dimemsion is equal to the second of an array.
 * @returns {length} - first dimemsion length
 */
function assertSquare(array) {
    let [N, D] = assertArray2D(array);
    assert(N === D, 'Array should have square number of elements.');
    return N;
}

function assertArray2D(array) {
    assert(checkClass(array, 'Array'), 'The object should be an array');
    assert(checkClass(array[0], 'Array'), 'The object should be an array of array');
    return [array.length, array[0].length];
}

export { assert, checkClass, checkTypeStrict, getNativeType, assertSquare, assertArray2D, isArray };