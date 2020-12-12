import {readFileSync} from 'fs';

let file = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_12.txt', 'utf-8');
var items = file.split("\n").filter(x => x.length > 0);

let waypoint_x = 10;
let waypoint_y = 1;

let ship_x=0;
let ship_y=0;

function turn_right(amount: number, str: string) {
    let original_x = waypoint_x;
    let original_y = waypoint_y;

    for (let i = 0; i < amount / 90; i++) {
        let old_x = waypoint_x;
        let old_y = waypoint_y;
        waypoint_y = -1 * waypoint_x;
        waypoint_x = old_y;
        console.log("Old bearing x=" + old_x + " y=" + old_y + " adjusted by R90 results in new direction x=" + +waypoint_x + " y=" + waypoint_y);
    }
    console.log("Old bearing " + original_x + ", " + original_y + " adjusted by " + str + " results in new direction " + +waypoint_x + ", " + waypoint_y);
    return;
}

items.forEach(str => {
    let d = /(\w)(\d+)/
    let row = d.exec(str);
    if (!row) {
        console.log("Can't parse " + str);
        return;
    }
    console.log("Location x=" + ship_x + ", y=" + ship_y + ", waypoint x=" + waypoint_x + ", y=" + waypoint_y);
    let way = row[1];
    let amount = +row[2];
    if (way == "E") {
        console.log("Moving east " + amount + " units");
        waypoint_x += amount;
        return;
    }
    if (way == "W") {
        console.log("Moving west " + amount + " units");
        waypoint_x -= amount;
        return;
    }
    if (way == "N") {
        console.log("Moving north " + amount + " units");
        waypoint_y += amount;
        return;
    }
    if (way == "S") {
        console.log("Moving south " + amount + " units");
        waypoint_y -= amount;
        return;
    }

    if (way == "R") {
        turn_right(amount, str);
        return;
    }

    if (way == "L") {
        let new_direction = (360 - amount);
        turn_right(new_direction, str);
        return;
    }

    if (way == "F") {
        for (let i = 0; i < amount; i++) {
            ship_x+=waypoint_x;
            ship_y+=waypoint_y;
        }
        return;
    }
    console.log("Unable to handle instruction " + row);
});

console.log("Reached end, ship x=" + ship_x + ", y=" + ship_y + ", manhattan distance " + (Math.abs(ship_y) + Math.abs(ship_x)));