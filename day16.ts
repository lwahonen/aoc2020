import {readFileSync} from 'fs';

let file = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_16.txt', 'utf-8').replace("your ticket:\n", "").replace("nearby tickets:\n", "");
var items = file.split("\n\n").filter(x => x.length > 0);

let rules = items[0].split("\n");
let your = items[1].split(",");
let theirs = items[2].split("\n").map(x => x.split(",").map(x => +x));

let parsed_rules = {};

// Parse rules
rules.forEach(x => {
    let rule_matcher = /([a-z ]+): (\d+)-(\d+) or (\d+)-(\d+)/
    let match = rule_matcher.exec(x);
    if (match) {
        var name = match[1];
        parsed_rules[name] = [];
        parsed_rules[name][0] = match[2];
        parsed_rules[name][1] = match[3];
        parsed_rules[name][2] = match[4];
        parsed_rules[name][3] = match[5];
    }
});

let invalids = [];
let validated_tickets = [];

// Validate individual numbers, gather array of valid tickets
theirs.forEach(ticket => {
        let this_valid = true;
        for (let i = 0; i < ticket.length; i++) {
            {
                let number = ticket[i];
                let invalid = true;
                Object.keys(parsed_rules).forEach(key => {
                    if (!invalid)
                        return;
                    let rule = parsed_rules[key];
                    let firstok = number >= rule[0] && number <= rule[1];
                    let ss = number >= rule[2] && number <= rule[3];
                    if (firstok || ss) {
                        invalid = false;
                        //       console.log("Number "+number+" verified by rule "+key+" "+rule);
                    }
                });
                if (invalid) {
                    //      console.log("Number "+number+" not verified by any rule");
                    this_valid = false;
                    invalids.push(number);
                }
            }
        }
        if (this_valid) {
            validated_tickets.push(ticket);
        }
    }
)

// Part 1 answer
let sum = 0;
invalids.forEach(x => sum += x);
console.log("Sum of invalid ticket entries for part 1 is " + sum);

// Build array of every single rule combination
let possible_names = [];
let rule_names = Object.keys(parsed_rules);
for (let i = 0; i < rule_names.length; i++) {
    possible_names[i] = {};
    for (let j = 0; j < rule_names.length; j++) {
        possible_names[i][rule_names[j]] = rule_names[j];
    }
}

// Pare down the possible rules array by filtering out impossible rules
for (let col = 0; col < validated_tickets[0].length; col++) {
    for (let rule = 0; rule < rule_names.length; rule++) {
        for (let row = 0; row < validated_tickets.length; row++) {
            let number = validated_tickets[row][col];
            let name = rule_names[rule];
            let rule_value = parsed_rules[name];
            let first_ok = number >= rule_value[0] && number <= rule_value[1];
            let second_ok = number >= rule_value[2] && number <= rule_value[3];
            if (!first_ok && !second_ok) {
                delete possible_names[col][name];
                // console.log("Rule " + name + " can't account for " + number);
                // console.log("Possible keys for " + col + " are now " + JSON.stringify(possible_names[col]));
                break;
            }
        }
    }
}

// Ugly loop. Keep whittling down possible rules until every slot only has one possible rule
let deleted = true;
while (deleted) {
    deleted = false;
    for (let i = 0; i < possible_names.length; i++) {
        let possibles = possible_names[i];
        // console.log("Possible keys for " + i + " are " + JSON.stringify(possibles));
        if (Object.keys(possibles).length == 1)
            continue;
        for (let j = 0; j < possible_names.length; j++) {
            let impossibles = possible_names[j];
            if (Object.keys(impossibles).length != 1)
                continue;
            let only = Object.keys(impossibles)[0];
            if (possibles.hasOwnProperty(only)) {
                // Entry x has only one possibility, so delete that possibility from other entries
                delete possibles[only];
                // console.log("Possible keys for " + i + " reduced to " + JSON.stringify(possibles));
                deleted = true;
                break;
            }
        }
    }
}

let part2 = 1;
for (let i = 0; i < possible_names.length; i++) {
    let s = Object.keys(possible_names[i])[0];
    // console.log("Possible keys for " + i + " are " + s);
    if (s.startsWith("departure")) {
        let value_in_mine = +your[i];
        part2 *= value_in_mine;
    }
}
console.log("Part 2 answer " + part2);