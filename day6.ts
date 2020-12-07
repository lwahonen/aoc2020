import {readFileSync} from 'fs';

const file = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_6.txt', 'utf-8');
var items = file.split("\n\n");

let part1 = 0;
let part2 = 0;

items.forEach(function (str) {
    let answers = 0;
    for (let i = 0; i <= 26; i++) {
        let people = str.split("\n");
        let c = String.fromCharCode(97 + i);
        let found = true;
        let foundone = false;
        for (let j = 0; j < people.length; j++) {
            if (!people[j].includes(c))
                found = false;
            if (people[j].includes(c))
                foundone = true;

        }
        if (foundone)
            part1++;
        if (found)
            part2++;
    }
});
console.log("Part 1 "+part1+" part 2 "+part2);
