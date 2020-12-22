import {readFileSync} from 'fs';

let file;

try {
    file = readFileSync('c:\\users\\lwahonen\\Dropbox\\advent\\2020\\data\\day_22.txt', 'utf-8');
} catch (e) {
    file = readFileSync('/Users/lwahonen/Dropbox/advent/2020/data/day_22.txt', 'utf-8');
}

let items = file.split("\n\n").filter(x => x.length > 0);

let firstDeck=items[0].split("\n").splice(1).filter(x=>x.length > 0).map(x=>+x);
let secondDeck=items[1].split("\n").splice(1).filter(x=>x.length > 0).map(x=>+x);

let cached_game_results={};

function recursive_combat(inputdeck1: any, inputdeck2: any, game:number, recursive:boolean) {
    let inputkey = "" + inputdeck1 + " and " + inputdeck2;
    if(cached_game_results.hasOwnProperty(inputkey))
        return cached_game_results[inputkey];
    let firstDeck=[...inputdeck1];
    let secondDeck=[...inputdeck2];
    let seen_pairs={};
    let round = 0;
    // console.log(`=== Game ${game} === Decks ${inputkey}`);
    while (firstDeck.length > 0 && secondDeck.length > 0) {
        round++;
        // console.log(`\n-- Round ${round} (Game ${game}) --`);
        let key = "" + firstDeck + "" + secondDeck;
        if (seen_pairs.hasOwnProperty(key)) {
            // console.log("I've been here before");
            cached_game_results[inputkey]=1;
            // console.log(`The winner of game ${game} is player 1!`);
            return 1;
        }
        seen_pairs[key] = true;
        // console.log("Player 1's deck: " + firstDeck);
        // console.log("Player 2's deck: " + secondDeck);
        let first = +firstDeck.shift();
        let second = +secondDeck.shift();
        let firstWon = first > second;
        // console.log("Player 1 plays: " + first);
        // console.log("Player 2 plays: " + second);
        if (recursive && firstDeck.length >= first && secondDeck.length >= second) {
            // console.log("Playing a sub-game to determine the winner...")
            firstWon = (recursive_combat(firstDeck.slice(0, first), secondDeck.slice(0, second), game + 1, recursive)) == 1;
        }
        if (firstWon) {
            firstDeck.push(first);
            firstDeck.push(second);
            // console.log(`Player 1 wins round ${round} of game ${game}!`);
        } else {
            secondDeck.push(second);
            secondDeck.push(first);
            // console.log(`Player 2 wins round ${round} of game ${game}!`);
        }
    }
    if(game == 1)
        count_scores(firstDeck, secondDeck)
    if(firstDeck.length == 0) {
        cached_game_results[inputkey]=2;
        // console.log(`The winner of game ${game} is player 2!`);
        return 2;
    }
    // console.log(`The winner of game ${game} is player 1!`);
    cached_game_results[inputkey]=1;
    return 1;
}

console.log("Part 1:")
recursive_combat([...firstDeck], [...secondDeck], 1, false);
cached_game_results={};
console.log("Part 2:")
recursive_combat([...firstDeck], [...secondDeck], 1, true);


function count_scores(firstDeck: any, secondDeck: any) {
    firstDeck = firstDeck.reverse();
    let first = 0;
    for (let i = 0; i < firstDeck.length; i++) {
        first += (i + 1) * firstDeck[i];
    }

    secondDeck = secondDeck.reverse();
    let second = 0;
    for (let i = 0; i < secondDeck.length; i++) {
        second += (i + 1) * secondDeck[i];
    }

    console.log("First players score " + first)
    console.log("Second players score " + second)
}
