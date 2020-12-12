import {readFileSync} from 'fs';

let file = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_12.txt', 'utf-8');
var items = file.split("\n").filter(x => x.length > 0);

let direction = 0;
let x = 0;
let y = 0;

items.forEach(str => {
    let d = /(\w)(\d+)/
    let row = d.exec(str);
    if (!row) {
        console.log("Can't parse " + str);
        return;
    }
    let way = row[1];
    let amount = +row[2];
    if (way == "E") {
        console.log("Moving east " + amount + " units");
        x += amount;
        return;
    }
    if (way == "W") {
        console.log("Moving west " + amount + " units");
        x -= amount;
        return;
    }
    if (way == "N") {
        console.log("Moving north " + amount + " units");
        y -= amount;
        return;
    }
    if (way == "S") {
        console.log("Moving south " + amount + " units");
        y += amount;
        return;
    }

    if (way == "R") {
        let new_direction = (direction + amount) % 360;
        console.log("Old bearing " + direction + " adjusted by " + amount + " results in new direction " + (new_direction));
        direction = new_direction;
        return;
    }

    if (way == "L") {
        let new_direction = ((direction + 360) - amount) % 360;
        console.log("Old bearing " + direction + " adjusted by " + amount + " results in new direction " + (new_direction));
        direction = new_direction;
        return;
    }

    if (way == "F") {
        console.log("Moving forward " + amount + " units with bearing " + direction);
        if (direction == 0) {
            x += amount;
            return;
        }
        if (direction == 90) {
            y += amount;
            return;
        }
        if (direction == 180) {
            x -= amount;
            return;
        }
        if (direction == 270) {
            y -= amount;
            return;
        }
        console.log("Unknown direction " + direction);
    }
    console.log("Unable to handle instruction " + row);
});

console.log("Location " + x + ", " + y + ", manhattan distance " + (Math.abs(x) + Math.abs(y)));