import {readFileSync} from 'fs';

const file = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_1.txt', 'utf-8');

var numbers = file.split("\n");
var part_A=0;
var part_B=0;

for (let i = 0; i < numbers.length; i++) {
    for (let j = i; j < numbers.length; j++) {
        for (let k = j; k < numbers.length; k++) {
            let first = +numbers[i];
            let second = +numbers[j];
            let third = +numbers[k];
            if (first + second == 2020)
                part_A=first*second;
            if (first + second + third == 2020)
                part_B=first * second * third;
        }
    }
}
console.log("Found part A " + part_A);
console.log("Found part B " + part_B);