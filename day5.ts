import {readFileSync} from 'fs';

const file = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_5.txt', 'utf-8');
var items = file.split("\n");


let maxid = 0;
let seats = [];

items.forEach(function (str) {
    var rowrange = [0, 127];
    var rowstep = 6;

    var colrange = [0, 7];
    var colstep = 2;

    for (let i = 0; i < str.length; i++) {
        if (str[i] == 'F') {
            rowrange[1] -= Math.pow(2, rowstep--);
            // console.log("Read " + str[i] + " so row is now " + rowrange);
        }
        if (str[i] == 'B') {
            rowrange[0] += Math.pow(2, rowstep--);
            // console.log("Read " + str[i] + " so row is now " + rowrange);
        }
        if (str[i] == 'L') {
            colrange[1] -= Math.pow(2, colstep--);
            // console.log("Read " + str[i] + " so column is now " + colrange);
        }
        if (str[i] == 'R') {
            colrange[0] += Math.pow(2, colstep--);
            // console.log("Read " + str[i] + " so column is now " + colrange);
        }
    }
    let row = rowrange[0];
    let seat = colrange[0];
    let id = row * 8 + seat;
    // console.log("Seat is " + seat + " " + row + " ID " + id);
    seats.push(id);
    if (id > maxid)
        maxid = id;
});
console.log("Max ID was " + maxid);

for (let i = 0; i < 128; i++) {
    for (let j = 0; j < 8; j++) {
        let ID = i * 8 + j;
        if (!seats.includes(ID))
            if (seats.includes(ID - 1))
                if (seats.includes(ID + 1))
                    console.log("My seat ID is " + ID);
    }
}
