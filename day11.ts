import {readFileSync} from 'fs';

let file = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_11.txt', 'utf-8');
var items = file.split("\n").filter(x => x.length > 0);
var seats = items.map(x => x.split(""));

console.log("Start from");
process_map(seats, true);

let part1 = seats;
while (true) {
    let new_part1 = update_map(part1, false, 4);
    if (compare_map(part1, new_part1)) {
        console.log("Ended part 1, count " + process_map(part1, true));
        break;
    }
    part1 = new_part1;
}

let part2 = seats;
while (true) {
    let new_part2 = update_map(part2, true, 5);
    if (compare_map(part2, new_part2)) {
        console.log("Ended part 2, count " + process_map(part2, true));
        break;
    }
    part2 = new_part2;
}

function process_map(map, show) {
    let seats = 0;
    for (let row = 0; row < map.length; row++) {
        let r = map[row];
        if (show)
            process.stdout.write("\n");
        for (let col = 0; col < r.length; col++) {
            let cell = map[row][col];
            if (cell == "#")
                seats++;
            if (show)
                process.stdout.write(cell);
        }
    }
    if (show)
        process.stdout.write("\n");
    return seats;
}


function compare_map(map, map1) {
    for (let row = 0; row < map.length; row++) {
        let r = map[row];
        for (let col = 0; col < r.length; col++) {
            let oldcell = map[row][col];
            let newcell = map1[row][col];
            if (oldcell != newcell)
                return false;
        }
    }
    return true;
}

function test_diagonal(map, row, col, rowdiff, coldiff, part2) {
    let r = map[row];
    while ((row + rowdiff) < map.length && (col + coldiff) < r.length && (row + rowdiff) >= 0 && (col + coldiff) >= 0) {
        if (map[row + rowdiff][col + coldiff] == "#") {
            return 1;
        }
        if (map[row + rowdiff][col + coldiff] == "L") {
            return 0;
        }
        if (!part2)
            return 0;
        row += rowdiff;
        col += coldiff;
    }
    return 0;
}

function update_map(map, part2, limit) {
    let return_map = [];
    for (let row = 0; row < map.length; row++) {
        return_map[row] = [];
        let r = map[row];
        for (let col = 0; col < r.length; col++) {
            let cell = map[row][col];
            if (cell == ".") {
                return_map[row][col] = cell;
                continue;
            }
            let count = 0;
            count += test_diagonal(map, row, col, -1, 0, part2);
            count += test_diagonal(map, row, col, 1, 0, part2);
            count += test_diagonal(map, row, col, 0, -1, part2);
            count += test_diagonal(map, row, col, 0, 1, part2);

            count += test_diagonal(map, row, col, 1, -1, part2);
            count += test_diagonal(map, row, col, 1, 1, part2);

            count += test_diagonal(map, row, col, -1, -1, part2);
            count += test_diagonal(map, row, col, -1, 1, part2);

            if (cell == "L" && count == 0) {
                return_map[row][col] = "#";
                continue
            }
            if (cell == "L" && count > 0) {
                return_map[row][col] = "L";
                continue
            }

            if (cell == "#" && count < limit) {
                return_map[row][col] = "#";
                continue
            }
            if (cell == "#" && count >= limit) {
                return_map[row][col] = "L";
                continue
            }

            console.log("Could not decide for cell " + row + ", " + col);
        }

    }
    return return_map;
}



