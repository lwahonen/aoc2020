import {readFileSync} from 'fs';

let file = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_13.txt', 'utf-8');
var rows = file.split("\n").filter(x => x.length > 0);
let departure_time = +rows[0];
let buses = rows[1].split(",").map(x => +x);

let wait = departure_time;
let selected_bus = 0;

console.log("I'm ready to leave at "+departure_time);
for (let i = 0; i < buses.length; i++) {
    let stamp = buses[i];
    if(isNaN(stamp))
        continue;
    let waitforbus=stamp-(departure_time % stamp);
    console.log("Bus number "+stamp+" goes in "+ waitforbus);
    if (waitforbus < wait) {
        wait = waitforbus;
        selected_bus = stamp;
        console.log("This is a better option, wait is only "+wait);
    }
}

console.log("Part 1 answer is " + (wait * selected_bus));

// Chinese remainder theorem for part 2
let multiplier = 1;
let CRT = 0;

for (let i = 0; i < buses.length; i++) {
    let bus = buses[i];
    // Still increases i => accounts for the x departures later
    if (isNaN(bus))
        continue;

    // Find multiplier that lets us have all buses leaving on target time
    while (true) {
        if ((CRT + i) % bus === 0) {
            multiplier *= bus;
            console.log("Bus number "+i+", goes every "+bus+" minutes, so jointly they go every "+multiplier+" minutes. CRT is "+CRT);
            break;
        }
        CRT += multiplier;
    }
}

console.log("Part 2 answer is " + CRT);

