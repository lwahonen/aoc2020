import {readFileSync} from 'fs';

let file = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_17.txt', 'utf-8');
var items = file.split("\n").filter(x => x.length > 0);

let universe=load_universe();

let part_2 = false;

for (let cycle = 1; cycle < 7; cycle++) {
    let new_universe = calculate_next_world(universe);
    console.log("Round " + cycle + " created " + Object.keys(new_universe).length);
    universe = new_universe;
}

universe=load_universe();
part_2 = true;
console.log("\nPart 2");

for (let cycle = 1; cycle < 7; cycle++) {
    let new_universe = calculate_next_world(universe);
    console.log("Round " + cycle + " created " + Object.keys(new_universe).length);
    universe = new_universe;
}


function find_coord_min_max(u) {
    let max_x = 0;
    let min_x = 0;

    let max_y = 0;
    let min_y = 0;

    let max_z = 0;
    let min_z = 0;

    let max_w = 0;
    let min_w = 0;
    let x_keys = Object.keys(u);
    for (let i = 0; i < x_keys.length; i++) {
        let coords = x_keys[i].split(",");
        let x = +coords[0];
        let y = +coords[1];
        let z = +coords[2];
        let w = +coords[3];

        if (x < min_x)
            min_x = x;
        if (x > max_x)
            max_x = x;
        if (y < min_y)
            min_y = y;
        if (y > max_y)
            max_y = y;
        if (z < min_z)
            min_z = z;
        if (z > max_z)
            max_z = z;
        if (w < min_w)
            min_w = w;
        if (w > max_w)
            max_w = w;
    }

    return {max_x, min_x, max_y, min_y, max_z, min_z, max_w, min_w};
}

function calculate_next_world(universe) {
    let new_universe = {};
    let {max_x, min_x, max_y, min_y, max_z, min_z, max_w, min_w} = find_coord_min_max(universe);
    for (let w = min_w - 1; w <= max_w + 1; w++) {
        for (let z = min_z - 1; z <= max_z + 1; z++) {
            for (let y = min_y - 1; y <= max_y + 1; y++) {
                for (let x = min_x - 1; x <= max_x + 1; x++) {
                    let count = 0;
                    for (let hyper = -1; hyper <= 1; hyper++) {
                        for (let horizontal = -1; horizontal <= 1; horizontal++) {
                            for (let vertical = -1; vertical <= 1; vertical++) {
                                for (let depth = -1; depth <= 1; depth++) {
                                    // Skip self
                                    if (horizontal == 0 && vertical == 0 && depth == 0 && hyper == 0)
                                        continue;
                                    // Skip hyperspace if asked
                                    if (hyper != 0 && !part_2)
                                        continue;
                                    let coordinates = get_key(x + horizontal, y + vertical, z + depth, w + hyper);
                                    let cell = universe[coordinates];
                                    if (typeof cell !== 'undefined') {
                                        if (cell == 1) {
                                            count++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    let key = get_key(x, y, z, w);
                    let was_alive = universe[key] == 1;
                    if ((was_alive && count == 2) || count == 3) {
                        new_universe[key] = 1;
                    }
                }
            }
        }
    }
    return new_universe;
}

function get_key(x: number, y: number, z: number, w: number) {
    return "" + x + "," + y + "," + z + "," + w;
}

function load_universe() {
    let universe = {};

    for (let y = 0; y < items.length; y++) {
        let row = items[y].split("");
        for (let x = 0; x < row.length; x++) {
            if (row[x] == "#") {
                universe[get_key(x, y, 0, 0)] = 1;
            }
        }
    }
    return universe;
}
