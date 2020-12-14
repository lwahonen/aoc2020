import {readFileSync} from 'fs';
var Long = require("long");

let file = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_14.txt', 'utf-8');
var rows = file.split("\n").filter(x => x.length > 0);

let mask = "";
let memory ={};

function applyMask(mask: string, t: number) {
    let targets=[];
    targets.push(Long.fromInt(t));
    for (let i = 35; i >= 0; i--) {
        let letter = mask[35 - i];
        if (letter == "0")
            continue;
        if (letter == "1") {
            var m = Long.ONE.shiftLeft(i);
            let newtargets=[];
            targets.forEach(t => newtargets.push(t.or(m)  ) );
            targets=newtargets;
        }
        if (letter == "X") {
            var m = Long.ONE.shiftLeft(i);
            let newtargets=[];
            targets.forEach(t => newtargets.push(t.or(m)  ) );
            let not = m.not();
            targets.forEach(t => newtargets.push(t.and(not)  ) );
            targets=newtargets;
        }
    }
    return targets;
}

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
        let tos=applyMask(mask, +result[1]);
        let data = +result[2];
        tos.forEach(x => memory[x]=data);
        console.log("Writing "+r+" with mask "+mask+" results in mem["+tos+"] = "+data);
        continue;
    }
    console.log("Unable to parse "+r);
}


let sum = Long.ZERO;
Object.keys(memory).forEach(key => {
    sum=sum.add(memory[key]);
});

console.log("Part 1 answer is " + sum);

