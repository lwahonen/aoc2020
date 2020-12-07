import {readFileSync} from 'fs';

let file = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_7.txt', 'utf-8');
file = file.replace(/bag[s]?[.]?/g, "");
var items = file.split("\n");

let neededkeys = ["shiny gold"];

let countedkeys = [];
let roots = 0;

while (neededkeys.length > 0) {
    let key = neededkeys.pop();
    // console.log("\n====\nFinding bags that could contain " + key);
    items.forEach(function (str) {
        let people = str.split("contain");
        if (people.length == 2) {
            if (people[1].includes(key)) {
                let color = people[0].trim();
                if (!countedkeys.includes(color)) {
                    // console.log(str);
                    roots++;
                    neededkeys.push(color);
                    countedkeys.push(color);
                }
            }
        }
    });
}
console.log("Part 1: " + roots + " roots found");

let rules = new Map<string, Map<string, number>>();

items.forEach(function (str) {
        let row = str.split("contain");
        if (row.length == 2) {
            let color = row[0].trim();
            let keys = row[1].trim();
            let bags = keys.split(",");
            bags = bags.map(x => x.trim());
            let current_bag;
            if (rules.has(color)) {
                current_bag = rules.get(color);
            } else {
                current_bag = new Map<string, number>();
                rules.set(color, current_bag);
            }

            bags.forEach(function (token) {
                    const rule = /(\d)+ (.*)/;
                    let rule_pair = rule.exec(token);
                    if (rule_pair) {
                        let token_number = +rule_pair[1];
                        let token_color = rule_pair[2];
                        let new_bag;
                        if (rules.has(token_color)) {
                            new_bag = rules.get(token_color);
                        } else {
                            new_bag = new Map<string, number>();
                            rules.set(token_color, new_bag);
                        }
                        current_bag.set(token_color, token_number);
                    }
                }
            )
        }
    }
);

let number = count("shiny gold") - 1;
console.log("Part 2: " + number+" other bags");

function count(name: string) {
    let c = 1;
    let r = rules.get(name);
    r.forEach((value: number, key: string) => {
            c += value * count(key);
        }
    );
    console.log("One "+name + " bag contains a total of " + c + " bags");
    return c;
}

