import {readFileSync} from 'fs';
var Long = require("long");

let file = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_14.txt', 'utf-8');
var rows = file.split("\n").filter(x => x.length > 0);

let mask = "";
let memory = [];

function applyMask(mask: string, t: number) {
    let target=Long.fromInt(t);
    for (let i = 35; i >= 0; i--) {
        let letter = mask[35 - i];
        if (letter == "X")
            continue;
        if (letter == "1") {
            var m = Long.ONE.shiftLeft(i);
            target=target.or(m);
        }
        if (letter == "0") {
            var m = Long.ONE.shiftLeft(i);
            let not = m.not();
            target=target.and(not);
        }
    }
    return target;
}

applyMask("XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X", 11);

for (let i = 0; i < rows.length; i++) {
    let r = rows[i];
    if (r.startsWith("mask")) {
        mask = r.split("=")[1].trim();
        console.log("New mask "+mask);
        continue;
    }
    let write = /mem\[(\d+)\] = (\d+)/
    let result = write.exec(r);
    if (result) {
     //   let to = applyMask(mask, +result[1]);
        let to=result[1];
        let data = applyMask(mask, +result[2]);
        memory[to] = data;
        console.log("Writing "+r+" with mask "+mask+" results in mem["+to+"] = "+data);
        continue;
    }
    console.log("Unable to parse "+r);

}
let sum = Long.ZERO;
memory.forEach(n => sum = sum.add(n));

console.log("Part 1 answer is " + sum);

