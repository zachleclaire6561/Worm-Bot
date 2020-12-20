class TestUtility {
    static printArray(arr) {
        if (!Array.isArray(arr))
            throw new Error('Invalid Parameter - Not an Array');
        arr.forEach(elements => console.log(arr))
    }
}