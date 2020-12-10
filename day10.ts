import {readFileSync} from 'fs';

let file = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_10.txt', 'utf-8');
var items = file.split("\n").filter(x => x.length > 0);

let target = 0;
let used = new Set();
let ones = 0;
let threes = 1;


while (used.size < items.length) {
    let next = false;
    for (let vtarget = 0; vtarget < 4 && !next; vtarget++) {
        for (let i = 0; i < items.length; i++) {
            if (used.has(i))
                continue;
            let voltage = +items[i];
            let diff = voltage - target;
            if (diff == vtarget) {
                used.add(i);
                console.log("Found adapter from " + target + " to " + voltage + ", have used " + used.size + " out of " + items.length);
                target = voltage;
                if (diff == 1)
                    ones++;
                if (diff == 3)
                    threes++;
                next = true;
                break;
            }
        }
    }
}
console.log("Total diff for part 1: " + (ones * threes));

// Part 2

let adapters = new Set();
let max_volt = 0;
for (let i = 0; i < items.length; i++) {
    let value = +items[i];
    let maxVolt = value;
    if (maxVolt > max_volt)
        max_volt = maxVolt;
    adapters.add(value);
}
adapters.add(0);

let counted = new Map();

function count(goal) {
    if (goal == 0)
        return 1;

    if (counted.has(goal))
        return counted.get(goal);


    let potentials = 0;
    if (adapters.has(goal - 1))
        potentials += count(goal - 1);
    if (adapters.has(goal - 2))
        potentials += count(goal - 2);
    if (adapters.has(goal - 3))
        potentials += count(goal - 3);

    counted.set(goal, potentials);
    return potentials;
}

let potential = count(max_volt);
console.log("Part 2: Can reach " + max_volt + " in " + potential + " different ways");
