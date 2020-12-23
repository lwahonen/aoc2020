import {readFileSync} from "fs";

import {find} from "./day20";

let part1_output=find({}, {}, {}, 0, 0);
let part1 = part1_output.replace(/\./g, "0").replace(/#/g, "1");

let parts = part1.split("\n\n").filter(x => x.length > 0);

let max_row = 0;
let max_col = 0;

let rowlen = 0;
let pixels = {};

parts.forEach(part => {
        let rows = part.split("\n").filter(x => x.length > 0);
        rowlen = rows[2].length - 2;
        let coords = rows[0].split("=")[1];
        // console.log("Found tile " + coords);
        let x = +coords.split(",")[1] * rowlen;
        let y = +coords.split(",")[0] * rowlen;

        rows = rows.splice(2);

        for (let row = 0; row < rows.length - 1; row++) {
            let r = rows[row].split("").map(x => +x).splice(1);
            for (let col = 0; col < r.length - 1; col++) {
                let cc = x + col;
                let rr = y + row;
                max_col = Math.max(cc, max_col);
                max_row = Math.max(rr, max_row);
                pixels["" + cc + "," + rr] = r[col];
            }
        }
    }
);

let sea = [];
for (let row = 0; row <= max_row; row++) {
    sea[row] = [];
    for (let col = 0; col <= max_col; col++) {
        sea[row][col] = pixels["" + col + "," + row];
    }
}

let seamonster =
`                  # 
#    ##    ##    ###
 #  #  #  #  #  #`;

let seamon = seamonster.split("\n").map(x => x.split(""));

function rotate(tile) {
    let tempr = [];
    for (let rownum = 0; rownum < tile.length; rownum++) {
        tempr[rownum] = [];
        for (let colnum = 0; colnum < tile.length; colnum++) {
            tempr[rownum][colnum] = tile[colnum][rownum];
        }
    }
    return tempr;
}

function getPermutations(inputrows: any) {
    let perms = [];

    for (let rotate_count = 0; rotate_count < 4; rotate_count++) {
        let rows = [...inputrows];
        let rotatestr = "";
        // Swap top edges with side edges
        if (rotate_count > 0) {
            for (let i = 0; i < rotate_count; i++) {
                rows = rotate(rows);
            }
            rotatestr += "_rotate" + rotate_count;
        }

        for (let topswap = 0; topswap < 2; topswap++) {
            let flipstr = rotatestr;
            let flipped_rows = [...rows];
            // Swap top pair
            if (topswap == 1) {
                flipstr += "_flip"
                flipped_rows = flipped_rows.reverse();
            }
            for (let sideswap = 0; sideswap < 2; sideswap++) {
                let mirrorstr = flipstr;
                let mirrored_rows = [...flipped_rows];
                // Swap side pair
                if (sideswap == 1) {
                    mirrorstr += "_mirror"
                    mirrored_rows = mirrored_rows.map(x => {
                        return x.reverse()
                    });
                }

                perms.push(mirrored_rows);
            }
        }
    }
    return perms;
}

function find_monster(x, y, sea) {
    for (let row = 0; row < seamon.length; row++) {
        for (let col = 0; col < seamon[0].length; col++) {
            let character = seamon[row][col];
            if (character != "#")
                continue;
            let check_x = col + x;
            let check_y = row + y;
            if (check_x >= sea[0].length)
                return false;
            if (check_y >= sea.length)
                return false;
            let square = sea[check_y][check_x];
            if (square == 0) {
                // console.log("No monster bit at " + check_y + ", " + check_x);
                return false;
            }
            // console.log("Found monster bit at " + check_y + ", " + check_x);
        }
    }
    return true;
}

let seas = getPermutations(sea);

let monstersize=(seamonster.match(/#/g) || []).length;
seas.forEach(s => {
    let killed = 0;
    for (let y = 0; y < max_row; y++) {
        for (let x = 0; x < max_col; x++) {
            if (find_monster(x, y, s)) {
             //   console.log("Found monster at " + x + ", " + y);
                killed++;
            }
        }
    }

    if (killed) {
        let sum = 0;
        for (let x = 0; x < s.length; x++) {
            for (let y = 0; y < s[0].length; y++) {
                if (s[x][y] == 1)
                    sum++;
            }
        }
        console.log("Part 2 answer is "+(sum-(killed * monstersize)));
        process.exit(0);
    }
});

