import {readFileSync} from 'fs';

const file = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_2.txt', 'utf-8');

var entries = file.split("\n");
const r = /(\d+)-(\d+) (\w): (\w+)/

let valid_A = 0;
let valid_B = 0;
for (let i = 0; i < entries.length; i++) {
    const m = r.exec(entries[i]);

    if (m) {
        let min = +m[1];
        let max = +m[2];
        let letter = m[3];
        let word = m[4];
        if (word[min-1] == letter && word[max-1] != letter)
            valid_B++;
        if (word[min-1] != letter && word[max-1] == letter)
            valid_B++;
        let charCount = charCount1(word, letter);
        if (charCount >= min && charCount <= max) {
            valid_A++;
        }
    }
}

console.log(valid_A);
console.log(valid_B);

function charCount1(s, c) {
    let count = 0;
    c = c.charAt(0); // we save some time here
    for (let i = 0; i < s.length; ++i) {
        if (c === s.charAt(i)) {
            ++count;
        }
    }
    return count;
}