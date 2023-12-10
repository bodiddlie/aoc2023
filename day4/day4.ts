import { getSampleInput, getInput } from "../util";

type Card = {
  num: number;
  matches: number;
  copies: number;
};

function parseLine(line: string): Card {
  let score = 0;
  const card = parseInt(line.split(":")[0].trim().split(/\s+/)[1]);
  const numbers = line.split(":")[1].trim();
  const winners = new Set(numbers.split("|")[0].trim().split(/\s+/));
  const picks = new Set(numbers.split("|")[1].trim().split(/\s+/));

  for (const num of winners) {
    if (picks.has(num)) {
      score++;
    }
  }

  return {
    num: card,
    matches: score,
    copies: 1,
  };
}

async function partOne(): Promise<number> {
  const lines = await getInput(4);

  let total = 0;

  for (const line of lines) {
    const card = parseLine(line);

    total += card.matches > 0 ? 2 ** (card.matches - 1) : 0;
  }

  return total;
}

async function partTwo(): Promise<number> {
  const lines = await getInput(4);

  let total = 0;

  const cardMap = {};
  for (const line of lines) {
    const card = parseLine(line);

    cardMap[card.num] = card;
  }

  for (const key in cardMap) {
    const { num, matches, copies } = cardMap[key];

    for (let i = 0; i < copies; i++) {
      for (let j = num + 1; j < num + matches + 1; j++) {
        if (cardMap[j]) {
          cardMap[j].copies++;
        }
      }
    }

    total += copies;
  }

  return total;
}

// partOne().then(console.log);
partTwo().then(console.log);
