import {readFileSync} from 'fs';

let file = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_19.txt', 'utf-8');
var items = file.split("\n\n").filter(x => x.length > 0);

let rsource = items[0].split("\n").filter(x => x.length > 0);
let entries = items[1].split("\n").filter(x => x.length > 0);
let rules = parse_rules(rsource);

/////////////////////////////
let part2 = false;
let compiled = new RegExp("^" + regexify(0) + "$");

// console.log("My full regex is " + compiled);
let count = 0;

entries.forEach(ste => {
    let result = compiled.exec(ste);
    // console.log("For target " + ste + " result is " + result)
    if (result)
        count++;
});
console.log("Part 1:" + count);
/////////////////////////////
part2 = true;
compiled = new RegExp("^" + regexify(0) + "$");

// console.log("My full regex is " + compiled);
count = 0;

entries.forEach(ste => {
    let result = compiled.exec(ste);

    // console.log("For target " + ste + " result is " + result)
    if (result)
        count++;
});
console.log("Part 2:" + count);

function runRule(nextrule) {
    return nextrule.reduce(function (full_rule, rule_number) {
        let parsed = regexify(rule_number);
        full_rule += parsed;
        return full_rule;
    }, "");
}

function regexify(id) {
    let ex = rules[id];
    // console.log("Parsing rule " + id + " it is " + JSON.stringify(ex));
    if (part2) {
        if (+id == 8) {
            let st = regexify("42");
            return "(" + st + "+)";
        }
        if (+id == 11) {
            let first = regexify("42");
            let second = regexify("31");
            let recursive = "(";
            for (let i = 1; i < 5; i++) {
                if (recursive.length > 1)
                    recursive += "|"
                recursive += "(" + first.repeat(i) + second.repeat(i) + ")";
            }
            recursive += ")";
            return recursive;
        }
    }

    if (ex["end"] == true) {
        return ex["target"];
    } else {
        return "(" + ex["targets"].map(x => runRule(x)).join("|") + ")";
    }
}

function parse_rules(rsource) {
    let rules = {};
    rsource.forEach(x => {
            let rrr = x.split(":");
            let id = rrr[0];
            let justchar = /^\s*"([ab])"\s*$/
            let test = justchar.exec(rrr[1]);
            if (test) {
                // console.log("Found end rule " + rrr[0] + ": " + test[1]);
                let lrule = {};
                lrule["end"] = true;
                lrule["target"] = test[1];
                rules[id] = lrule;
                return;
            }
            let pairs = rrr[1].split("|").filter(x => x.length > 0);

            let lrule = {};
            lrule["end"] = false;

            lrule["targets"] = pairs.map(x => x.split(" ").filter(x => x.length > 0));
            rules[id] = lrule;
        }
    )
    return rules;
}
