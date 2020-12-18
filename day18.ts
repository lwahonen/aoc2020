import {readFileSync} from 'fs';

let file = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_18.txt', 'utf-8');
var items = file.split("\n").filter(x => x.length > 0);

let part2=false;
let sum=0;
items.forEach(x => sum+=solvestack(x));
console.log("Part 1: "+sum);

part2=true;
sum=0;
items.forEach(x => sum+=solvestack(x));
console.log("Part 2: "+sum);

function solvestack(stack) {
    // console.log("Solving stack "+stack);
    let term = /\(([^()]+)\)/

    while (true) {
        let a = term.exec(stack);

        if (a) {
            let subexpr = a[1];
            let replaceValue: string;
            if(part2)
            replaceValue = "" + solve_2(subexpr);
            else
            replaceValue = "" + solve_1(subexpr);
            // console.log("Replaced " + a[0] + " with " + replaceValue);
            stack = stack.replace(a[0], replaceValue);
        } else break;
    }
    let number: number;
    if(part2)
        number = +solve_2(stack);
    else
        number = solve_1(stack);

    // console.log("Stack result "+number);
    return +number;
}

function solve_2(exp: string) {
    // console.log("Solving " + exp);

    let sumterm = /\s*(\d+)\s*[+]\s*(\d+)/

    while (true) {
        let sum = sumterm.exec(exp);

        if (sum) {
            let first = +sum[1];
            let second = +sum[2];
            let target = sum[0];
            exp=exp.replace(target, ""+(first+second));
            // console.log("Now solving "+exp);
        } else break;
    }
    let multiply = /\s*(\d+)\s*[*]\s*(\d+)/

    while (true) {
        let product = multiply.exec(exp);

        if (product) {
            let first = +product[1];
            let second = +product[2];
            let target = product[0];
            exp=exp.replace(target, ""+(first*second));
            // console.log("Now solving "+exp);
        } else break;
    }
    let value=+exp;
    // console.log("Solved, value is "+value);
    return value;
}

function solve_1(exp: string) {
    // console.log("Solving " + exp);
    let first = /(\d+) (.*)/

    let m = first.exec(exp);
    let value = +m[1];
    exp = m[2];

    let term = /^\s*([+*])\s*(\d+)(.*)/

    while (true) {
        let a = term.exec(exp);

        if (a) {
            let num = a[2];
            let op = a[1];
            exp = a[3];
            let n = +num;
            if (op == "*")
                value = value * n;
            if (op == "+")
                value = value + n;
        } else break;
    }
    // console.log("Solved, value is "+value);
    return value;
}