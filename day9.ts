import {readFileSync} from 'fs';

let file = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_9.txt', 'utf-8');
var items = file.split("\n").filter(x => x.length > 0);

let keys = [];

let HEADERSIZE = 25;
for (let i = 0; i < HEADERSIZE; i++) {
    keys.push(+items[i]);
}

let part1 = 0;
for (let i = HEADERSIZE; i < items.length; i++) {
    let key = +items[i];
    let valid = false;
    for (let j = 0; j < keys.length; j++) {
        for (let k = j; k < keys.length; k++) {
            let first = keys[k];
            let second = keys[j];
            if (key == (first + second))
                valid = true;
        }
    }
    keys.shift();
    keys.push(key);
    if (!valid) {
        console.log("Part 1 key is " + key);
        part1 = key;
        break;
    }
}

for (let j = 0; j < items.length; j++) {
    let sum = 0;
    for (let k = j; k < items.length; k++) {
        sum += +items[k];
        if (sum > part1)
            break;
        if (sum == part1) {
            let smallest = 999999999999999;
            let largest = 0;
            for (let i = j; i < k; i++) {
                let number = +items[i];
                if (number > largest)
                    largest = number;
                if (number < smallest)
                    smallest = number;
            }
            console.log("Part 2 is " + (smallest + largest));
            process.exit(0);
        }
    }
}


