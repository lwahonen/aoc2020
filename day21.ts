import {readFileSync} from 'fs';

let file = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_21.txt', 'utf-8').replace("your ticket:\n", "").replace("nearby tickets:\n", "");
var items = file.split("\n").filter(x => x.length > 0);

let allergen_to_name = {};
let names_to_allergen = {};

// Parse rules
items.forEach(x => {
    let pair = x.split("(");
    let ingredients = pair[0].split(" ").map(x => x.trim()).filter(x => x.length > 0);

    let contains = pair[1].substring("contains".length, pair[1].length - 1);
    let allergens = contains.split(",").map(x => x.trim());

    names_to_allergen[JSON.stringify(ingredients)] = [];
    for (let a in allergens) {
        let allergen = allergens[a];
        if (!allergen_to_name.hasOwnProperty(allergen))
            allergen_to_name[allergen] = [];
        ingredients.forEach(ing => {
            if (!allergen_to_name[allergen].includes(ing))
                allergen_to_name[allergen].push(ing);
        });
        names_to_allergen[JSON.stringify(ingredients)].push(allergen);
    }
});

let allergen_real_names = test({});
console.log("Found allergen list " + JSON.stringify(allergen_real_names));

let part1 = 0;
for (let names in names_to_allergen) {
    let nnn = JSON.parse(names);
    // console.log("\nCounting score for "+nnn);
    nnn.forEach(name => {
        if (allergen_real_names.hasOwnProperty(name)) {
            // console.log("Not counting " + name + " as we know it's " + allergen_real_names[name]);
        } else {
            // console.log("Counting "+name+" as it's not an allergen");
            part1++;
        }
    })
}
console.log("Part 1 answer " + part1);

let part2 = Object.values(allergen_real_names).sort();
let log = "";
part2.forEach(allergen => {
    Object.keys(allergen_real_names).forEach(name => {
            if (allergen_real_names[name] == allergen)
                log += "," + name;
        }
    )
});
console.log("Part 2 answer is " + log.substring(1));

function test(names) {
    if (Object.keys(names).length == Object.keys(allergen_to_name).length) {
        return names;
    }
    for (let allergen in allergen_to_name) {
        if (Object.values(names).includes(allergen)) {
            // console.log("Already assigned " + allergen);
            continue;
        }
        // console.log("Looking for a name for " + allergen);
        let potentialnames = allergen_to_name[allergen];
        for (let p in potentialnames) {
            let potential = potentialnames[p];
            if (Object.keys(names).includes(potential)) {
                // console.log("Already assigned " + potential + " to " + names[potential]);
                continue;
            }
            // if (name_to_allergen[potential].includes(allergen)) {
            // console.log("Trying to use name " + potential + " for " + allergen);
            let fits = true;
            for (let contents in names_to_allergen) {
                let allergies = names_to_allergen[contents];
                if (allergies.includes(allergen)) {
                    if (contents.includes(potential)) {
                        // console.log("Ok, " + contents + " has name " + potential + " and allergen " + allergen);
                    } else {
                        // console.log("Fail, " + contents + " has name " + potential + " but no " + allergen);
                        fits = false;
                        break;
                    }
                } else {
                    // console.log("Ok, " + contents + " does not have allergen " + allergen);
                }
            }
            if (!fits)
                continue;
            let newnames = {...names};
            newnames[potential] = allergen;
            let listed = test(newnames);
            if (listed != null)
                return listed;
        }
    }
    return null;
}