import {readFileSync} from 'fs';

let file = readFileSync('c:\\users\\lwahonen\\Dropbox\\advent\\2020\\data\\day_20.txt', 'utf-8');
file = file.replace(/#/g, "1");
file = file.replace(/\./g, "0");
var items = file.split("\n\n").filter(x => x.length > 0);

var tiles = {};
let RIGHT = 0;
let BOTTOM = 1;
let LEFT = 2;
let TOP = 3;
let ROW_LENGTH = -1;
let PUZZLE_SIZE = 0;

items.forEach(tile => {
        PUZZLE_SIZE++;
        let r = tile.split("\n").filter(x => x.length > 0);
        let tt=parse_tile(r.slice(1), r[0].substr(5,4));
        // console.log("Tile " + JSON.stringify(tt));
        tiles[tt["name"]] = tt;
    }
)

PUZZLE_SIZE = Math.sqrt(PUZZLE_SIZE);

function parse_tile(r, name) {
    let tt = {};
    tt["name"] = name;
    tt["top"] = parseInt(r[0], 2);
    tt["bottom"] = parseInt(r[r.length - 1], 2);
    let left = "";
    let right = "";
    for (let i = 0; i < r.length; i++) {
        let row = r[i];
        left += row[0];
        right += row[row.length - 1];
    }
    if (ROW_LENGTH == -1)
        ROW_LENGTH = left.length;

    tt["left"] = parseInt(left, 2);
    tt["right"] = parseInt(right, 2);
    tt["rows"] = r;
    return tt;
}

function reverse(n: number): number {
    let value = n.toString(2).padStart(ROW_LENGTH, "0");
    value = value
        .split("")
        .reverse()
        .join("");
    return parseInt(value, 2);
}

function reversest(value: string): string {
    value = value
        .split("")
        .reverse()
        .join("");
    return value;
}


function testpieces(first: any, second: any, orient: number) {
    if (orient == RIGHT) {
        return first["right"] == second["left"];
    }
    if (orient == BOTTOM) {
        return first["bottom"] == second["top"];
    }
    if (orient == TOP) {
        return first["top"] == second["bottom"];
    }
    if (orient == LEFT) {
        return first["left"] == second["right"];
    }
}

let piece_test_cache = {};

function testvariants(first: any, piecename: any, orient: number) {
    let fits = {};
    let varr = variants[piecename];
    let v = first["name"] + "," + piecename + "," + orient;
    if (piece_test_cache.hasOwnProperty(v))
        return piece_test_cache[v];
    for (var variantname in varr) {
        let piece = varr[variantname];
        if (testpieces(first, piece, orient))
            fits[piece["name"]] = piece;
    }
    piece_test_cache[v] = fits;
    return fits;
}

let names = Object.keys(tiles);
console.log("Piece count=" + names.length);

let variants = {};

for (var realname in tiles) {
    let permutations = getPermutations(tiles[realname]);
    variants[realname] = permutations;
    Object.assign(tiles, permutations);
}

let top_pieces = [];
for (var bottomname in variants) {
    for (var piecename in variants[bottomname]) {
        let piece = tiles[piecename];
        let fits = true;
        for (var topname in variants) {
            if (topname == bottomname)
                continue;
            let abovematch = testvariants(piece, topname, TOP);
            if (Object.keys(abovematch).length > 0) {
                fits = false;
                break;
            }
        }
        if (fits)
            top_pieces.push(piecename);
    }
}

let left_pieces = [];
for (var bottomname in variants) {
    for (var piecename in variants[bottomname]) {
        let piece = tiles[piecename];
        let fits = true;
        for (var topname in variants) {
            if (topname == bottomname)
                continue;
            let abovematch = testvariants(piece, topname, LEFT);
            if (Object.keys(abovematch).length > 0) {
                fits = false;
                break;
            }
        }
        if (fits)
            left_pieces.push(piecename);
    }
}


let right_pieces = [];
for (var bottomname in variants) {
    for (var piecename in variants[bottomname]) {
        let piece = tiles[piecename];
        let fits = true;
        for (var topname in variants) {
            if (topname == bottomname)
                continue;
            let abovematch = testvariants(piece, topname, RIGHT);
            if (Object.keys(abovematch).length > 0) {
                fits = false;
                break;
            }
        }
        if (fits)
            right_pieces.push(piecename);
    }
}

find({}, {}, {}, 0, 0);


function find(placed, placenames, placedexact, row, col) {
    if (row == PUZZLE_SIZE) {
        console.log("Found puzzle answer " + JSON.stringify(placed))
        let mult = 1;
        for (var answer in placenames) {
            let a = placenames[answer];
            if (a[0] == 0 && a[1] == 0) {
                console.log("Top left corner " + answer);
                mult *= +answer;
            }

            if (a[0] == 0 && a[1] == PUZZLE_SIZE - 1) {
                console.log("Top right corner " + answer);
                mult *= +answer;
            }

            if (a[0] == PUZZLE_SIZE - 1 && a[1] == 0) {
                console.log("Bottom left corner " + answer);
                mult *= +answer;
            }

            if (a[0] == PUZZLE_SIZE - 1 && a[1] == PUZZLE_SIZE - 1) {
                console.log("Bottom right corner " + answer);
                mult *= +answer;
            }
        }
        console.log("mult " + mult);
        process.exit(0);
    }
    // console.log("Testing "+row+","+col+" with puzzle " + JSON.stringify(placedexact));

    let key = "" + row + "," + col;
    for (var piecename in variants) {
        if (placenames.hasOwnProperty(piecename))
            continue;
        let pieces = {...variants[piecename]};
        if (row > 0) {
            let above = placed["" + (row - 1) + "," + col];
            let abovematch = testvariants(above, piecename, BOTTOM);
            if (Object.keys(abovematch).length === 0)
                continue;
            pieces = abovematch;
        }
        if (col > 0) {
            let left = placed["" + row + "," + (col - 1)];
            let leftmatch = testvariants(left, piecename, RIGHT);
            if (Object.keys(leftmatch).length === 0)
                continue;
            for (var keyname in pieces)
                if (!leftmatch.hasOwnProperty(keyname))
                    delete pieces[keyname];
        }
        for (var tilename in pieces) {
            if (row == 0 && !top_pieces.includes(tilename)) {
                continue;
            }
            if (col == 0 && !left_pieces.includes(tilename)) {
                continue;
            }
            if (col == PUZZLE_SIZE - 1 && !right_pieces.includes(tilename)) {
                continue;
            }
            let tile = pieces[tilename];


            let realname = tile["name"].substring(0, 4);
            let now_placed = {...placed};
            let now_place_names = {...placenames};
            let now_place_exact = {...placedexact};
            now_placed[key] = tile;
            now_place_names[realname] = [row, col];
            now_place_names[key] = tile["name"];
            let nowcol = col + 1;
            let nowrow = row;
            if (nowcol == PUZZLE_SIZE) {
                nowrow++;
                nowcol = 0;
            }

            find(now_placed, now_place_names, now_place_exact, nowrow, nowcol);
        }
    }
}

function rotate(tile) {
    let tempr = [];
    for (let rownum = 0; rownum < ROW_LENGTH; rownum++) {
        tempr[rownum] = "";
        for (let colnum = 0; colnum < ROW_LENGTH; colnum++) {
            tempr[rownum] += tile[colnum][rownum];
        }
    }
    return tempr;
}

function getPermutations(tile: any) {
    let perms = {};
    perms[tile["name"]] = tile;

    for (let rotate_count = 0; rotate_count < 4; rotate_count++) {
        let rows = [...tile["rows"]];
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
            let flipped_rows=[...rows];
            // Swap top pair
            if (topswap == 1) {
                flipstr += "_flip"
                flipped_rows = flipped_rows.reverse();
            }
            for (let sideswap = 0; sideswap < 2; sideswap++) {
                let mirrorstr = flipstr;
                let mirrored_rows=[...flipped_rows];
                // Swap side pair
                if (sideswap == 1) {
                    mirrorstr += "_mirror"
                    mirrored_rows = mirrored_rows.map(x => reversest(x));
                }

                let newtile = parse_tile(mirrored_rows, tile["name"] + mirrorstr);
                perms[newtile["name"]] = newtile;
            }
        }
    }
    return perms;
}

function print(n)
{
    return n.toString(2).padStart(ROW_LENGTH, "0");
}