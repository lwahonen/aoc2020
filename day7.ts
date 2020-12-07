import {readFileSync} from 'fs';

let file = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_7.txt', 'utf-8');
file = file.split("bags").join("bag");
var items = file.split("\n");


let neededkeys = ["shiny gold bag"];

let countedkeys = [];
let yes = 0;

while (neededkeys.length > 0) {
    let key = neededkeys.pop();
    console.log("\n====\nFinding bags that could contain " + key);
    items.forEach(function (str) {
        let people = str.split("contain");
        if (people.length == 2) {
            if (people[1].includes(key)) {
                let color = people[0].trim();
                if (!countedkeys.includes(color)) {
                    console.log(str);
                    yes++;
                    neededkeys.push(color);
                    countedkeys.push(color);
                }
            }
        }
    });
}
console.log("Part 1: " + yes + " roots found");
