import {readFileSync} from "fs";

var LinkedList = require('linked-list')
let file = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_23.txt', 'utf-8');
let input = file.split("\n")[0];


function print_cups(list, current) {
    let n = list.head;
    let j = "";
    while (n != null) {
        if (n == current)
            j += " ( ";
        j += n["value"];
        if (n == current)
            j += " ) ";
        n = n.next;
    }
    return j;
}

function next_with_circular(current: any, list: any) {
    if (current.next !== null)
        return current.next;
    else
        return list.head;
}

function create_node(value: number, maxid: number, minid: number, nodes: {}, list: any) {
    let insert = new LinkedList.Item();
    insert["value"] = value;
    maxid = Math.max(maxid, value);
    minid = Math.min(minid, value);
    nodes[value] = insert;
    list.append(insert);
    return {maxid, minid};
}

function run_game(part2: boolean) {
    let length = 100;
    if (part2)
        length = 10000000;
    let maxid = 0;
    let minid = 9;

    let nodes = {};

    let list = new LinkedList();

    input.split("").forEach(x => {
            let max_min = create_node(+x, maxid, minid, nodes, list);
            maxid = max_min.maxid;
            minid = max_min.minid;
        }
    );

    let created = input.length;
    if (part2) {
        for (let i = maxid + 1; created < 1000000; i++) {
            let max_min = create_node(i, maxid, minid, nodes, list);
            maxid = max_min.maxid;
            minid = max_min.minid;
            created++;
        }
    }

    let current = list.head;

    for (let i = 1; i < length + 1; i++) {
        // console.log("After round "+i+" cups are "+print_cups(list, current));
        let take1 = next_with_circular(current, list).detach();
        let take2 = next_with_circular(current, list).detach();
        let take3 = next_with_circular(current, list).detach();

        let find = current["value"];
        do {
            find--;
            if (find < minid)
                find = maxid;
        }
        while (find == take1["value"] || find == take2["value"] || find == take3["value"]);


        let go = nodes[find];
        go.append(take1);
        take1.append(take2);
        take2.append(take3);

        current = next_with_circular(current, list);
    }
    if (part2 == false) {
        console.log("Game 1 finished, cups are " + print_cups(list, current));
    } else {
        let cup1 = nodes[1];
        console.log("Game 2 result " + cup1.next["value"] * cup1.next.next["value"]);
    }
}

run_game(false);
run_game(true);

