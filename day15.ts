import {readFileSync} from 'fs';

let file = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_15.txt', 'utf-8');
var input = file.split("\n").filter(x => x.length > 0)[0].split(",").map(x => +x);

let memory1 = new Map();
let memory2 = new Map();

let turn = 0;
let last = 1;

// Prepack
for (let i = 0; i < input.length; i++) {
    memory1.set(input[i], i + 1);
    turn++;
    console.log("Saying " + input[i] + " on turn " + memory1.get(input[i]));
}

while (turn < 30000001) {
    turn++;
    if (!memory2.has(last)) {
        if (turn == 2020 || turn == 30000000)
            console.log("Turn " + turn + ":"+last+" has not been said before, saying 0");
        memory2.set(0, memory1.get(0));
        memory1.set(0, turn);
        last = 0;
        continue;
    }
    let diff = memory1.get(last) - memory2.get(last);
    if (turn == 2020 || turn == 30000000)
        console.log("Turn " + turn + ": "+last+" has been said before on turns " + memory1.get(last) + " and " + memory2.get(last) + ", saying " + diff);
    last = diff;
    if (memory1.has(last))
        memory2.set(last, memory1.get(last));
    memory1.set(last, turn);
}


