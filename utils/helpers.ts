export function getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function getUniqueRndIntegers(min: number, max: number, total: number) {
    const arr = [];
    while (arr.length < total) {
        var r = getRndInteger(min, max);
        if (arr.indexOf(r) === -1) arr.push(r);
    }
    return arr
}