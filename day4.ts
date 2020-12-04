import {readFileSync} from 'fs';

// Nine digits
const pid = /^\d{9}$/;
// Hair color
const hcl = /^#[0-9a-f]{6}$/;
// Length in inches
const inches = /^(\d+)+in$/;
// Length in cm
const cm = /^(\d+)+cm$/;

var needed = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];
var eyecolors = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];

const file = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_4.txt', 'utf-8');
// Pasports span multiple lines and are separated by empty lines
let join_single_lines = file.replace(/([^\n])\n([^\n])/g, '$1 $2').replace(/\n+/g, "\n");
let passports = join_single_lines.split("\n").filter(row => row.length > 0);


var items = passports.map(x => x.split(" "));

let count_a = 0;
let count_b = 0;
items.forEach(function (value) {
        var dictionary = {};
        var pairs = value.map(x => x.split(":"));
        pairs.forEach(pair => dictionary[pair[0]] = pair[1]);
        let found = true;
        needed.forEach(need => {
            if (!(need in dictionary)) found = false;
        });
        if (found) {
            count_a++;
            if (!check_year(dictionary, 'byr', 1920, 2002))
                return;
            if (!check_year(dictionary, 'iyr', 2010, 2020))
                return;
            if (!check_year(dictionary, 'eyr', 2020, 2030))
                return;

            if (!pid.exec(dictionary['pid']))
                return;

            if (!hcl.exec(dictionary['hcl']))
                return;

            let cmresult = cm.exec(dictionary['hgt']);
            let inchresult = inches.exec(dictionary['hgt']);
            if (!inchresult && !cmresult)
                return;

            if (inchresult && (+inchresult[1] < 59 || +inchresult[1] > 76))
                return;

            if (cmresult && (+cmresult[1] < 150 || +cmresult[1] > 193))
                return;

            if (!(eyecolors.includes(dictionary['ecl'])))
                return;

            count_b++;
        }
    }
);

console.log("Found valid strings " + count_a + " part 2 " + count_b);


function check_year(dictionary: {}, key = 'byr', minimum = 1920, maximum = 2002) {
    const year = /^(\d+){4}$/;
    let byr = year.exec(dictionary[key]);
    if (byr && +byr[0] >= minimum && +byr[0] <= maximum)
        return true;
    return false;
}