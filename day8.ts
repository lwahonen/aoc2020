import {readFileSync} from 'fs';

let file = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_8.txt', 'utf-8');
var items = file.split("\n").filter(x=>x.length > 0);

let acc = 0;
let ipc = 0;

let visited = new Set();
let tried = new Set();
let trying_line;
let trying_ipc=-1;
let last_instr;
let jmp_regex = /jmp ([-+])(\d+)/
let acc_regex = /acc ([-+])(\d+)/

function halted() {
    if (trying_ipc != -1) {
        // Restore sourced code
        tried.add(""+trying_ipc+":"+items[trying_ipc]);
        tried.forEach(item => console.log("Have tried "+item))
        items[trying_ipc] = trying_line;
        console.log("Restored line " + trying_ipc + " to " + items[trying_ipc]);
        trying_ipc = -1;
    }
    // Patch
    let patch= items[last_instr].replace("jmp", "tmp").replace("nop", "jmp").replace("tmp", "nop");
    if(!tried.has(""+last_instr+":"+patch)) {
        // Restore ICP and caches
        trying_ipc=last_instr;
        trying_line=items[last_instr];
        tried.add(""+trying_ipc+":"+trying_line);
        items[trying_ipc]=patch;
        console.log("Patched line " + trying_ipc + " from " + trying_line + " to " + patch);
    }
    else
    {
        console.log("Already tried patching " + last_instr + " from " + items[last_instr] + " to " +patch+", finding a new patch candidate");
    }
    visited.clear();
    acc=0;
    ipc=0;
    last_instr = 0;
    // Next time, reset the default instruction
}

while (ipc < items.length) {
    if (visited.has(ipc)) {
        halted();
    }
    visited.add(ipc);
    let input = items[ipc];
    if (input.startsWith('nop')) {
        if(!tried.has(""+ipc+":"+items[ipc]))
        {
            last_instr=ipc;
            console.log("Last candidate "+last_instr+" is "+items[last_instr]);
        }
        ipc++;
        continue;
    }
    let acc_test = acc_regex.exec(input);
    if (acc_test) {
        if (acc_test[1] == '+')
            acc += +acc_test[2];
        if (acc_test[1] == '-')
            acc -= +acc_test[2];
        ipc++;
        continue;
    }
    let jmp_test = jmp_regex.exec(input);
    if (jmp_test) {
        // Stupid gotcha
        if(+jmp_test[2] == 0)
            halted();
        else {
            if (!tried.has(""+ipc+":"+items[ipc])) {
                last_instr = ipc;
                console.log("Last candidate "+last_instr+" is "+items[last_instr]);
            }
            if (jmp_test[1] == '+')
                ipc += +jmp_test[2];
            if (jmp_test[1] == '-')
                ipc -= +jmp_test[2];
        }
        continue;
    }
}
console.log("Machine stopped with accumulator "+acc);

