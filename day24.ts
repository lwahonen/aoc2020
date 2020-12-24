import {readFileSync} from "fs";

var LinkedList = require('linked-list')
let input = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_24.txt', 'utf-8').split("\n").filter(x => x.length > 0).map(x => x.split(""));

let initial = {};

input.forEach(path => {
    let x = 0;
    let y = 0;
    while (true) {
        if (path.length == 0) {
            let key = x + "," + y;
            if (initial.hasOwnProperty(key)) {
                // console.log("Removing " + key);
                delete initial[key];
            } else {
                // console.log("Setting " + key);
                initial[key] = [x, y];
            }
            return;
        }
        let char = path.shift();
        let peek = " ";
        if (path.length > 0) {
            peek = path[0];
        }
        if (char == "e") {
            x += 2;
            let key = x + "," + y;
            // console.log("Went east, now at " + key);
        }
        if (char == "w") {
            x -= 2;
            let key = x + "," + y;
            // console.log("Went west, now at " + key);
        }
        if (char == "n") {
            if (peek == "e") {
                path.shift();
                y += 1;
                x += 1;
                let key = x + "," + y;
                // console.log("Went northeast, now at " + key);
            } else if (peek == "w") {
                path.shift();
                y += 1;
                x -= 1;
                let key = x + "," + y;
                // console.log("Went northwest, now at " + key);
            }
        }
        if (char == "s") {
            if (peek == "e") {
                path.shift();
                y -= 1;
                x += 1;
                let key = x + "," + y;
                // console.log("Went southeast, now at " + key);
            } else if (peek == "w") {
                path.shift();
                y -= 1;
                x -= 1;
                let key = x + "," + y;
                // console.log("Went southwest, now at " + key);
            }
        }
    }
});

console.log("Part 1 answer " + Object.keys(initial).length);

for (let i = 0; i < 100; i++) {
    initial = runGame(initial);
    console.log("After round " + (i + 1) + " I have tile count " + Object.keys(initial).length);
}

function runGame(tiles: any) {
    let newkeys = {};
    let maxx = 0;
    let maxy = 0;
    let miny = 0;
    let minx = 0;
    Object.values(tiles).forEach(pair => {
        let xx = pair[0];
        let yy = pair[1];
        maxx = Math.max(xx, maxx);
        maxy = Math.max(yy, maxy);
        minx = Math.min(xx, minx);
        miny = Math.min(yy, miny);
    });

    // console.log("Running game from rows " + miny + " to " + maxy + " and columns " + minx + " to " + maxx);
    for (let y = miny - 3; y < maxy + 3; y++) {
        for (let x = minx - 3; x < maxx + 3; x++) {
            let count = 0;
            // West
            count += checktile(x - 2, y, tiles);
            // East
            count += checktile(x + 2, y, tiles);
            // Northeast
            count += checktile(x + 1, y + 1, tiles);
            // Southeast
            count += checktile(x + 1, y - 1, tiles);
            // Southwest
            count += checktile(x - 1, y - 1, tiles);
            // Northwest
            count += checktile(x - 1, y + 1, tiles);
            // Self
            let black = checktile(x, y, tiles) == 1;
            if (black) {
                if (count == 1 || count == 2) {
                    let key = "" + x + "," + y;
                    newkeys[key] = [x, y];
                }
            } else {
                if (count == 2) {
                    let key = "" + x + "," + y;
                    newkeys[key] = [x, y];
                }
            }
        }
    }
    return newkeys;
}


function checktile(x: number, y, tiles: any) {
    let key = "" + x + "," + y;
    if (tiles.hasOwnProperty(key))
        return 1;
    return 0;
}
