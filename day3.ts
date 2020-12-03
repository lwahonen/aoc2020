import {readFileSync} from 'fs';

const file = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_3.txt', 'utf-8');
var strings = file.split("\n");
const char_arrays = strings.map(x => x.split(""));
let rowsize = strings[0].length;

function countTrees(right, down) {
    let position = 0;
    let treecount = 0;
    for (let i = 0; i < char_arrays.length; i += down) {
        let checkme = char_arrays[i][position];
        if (checkme == '#')
            treecount++;
        position += right;
        if (position >= rowsize)
            position -= rowsize;
    }
    return treecount;
}

let slope_1_1 = countTrees(1, 1);
let slope_3_1 = countTrees(3, 1);
let slope_5_1 = countTrees(5, 1);
let slope_7_1 = countTrees(7, 1);
let slope_1_2 = countTrees(1, 2);
console.log("Tree count on part 1 is " + slope_3_1);
console.log("Tree count on part 2 is " + (slope_1_1 * slope_3_1 * slope_5_1 * slope_7_1 * slope_1_2));
