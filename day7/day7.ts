import { getSampleInput, getInput } from "../util";

// const cardValues = {
//   "2": 2,
//   "3": 3,
//   "4": 4,
//   "5": 5,
//   "6": 6,
//   "7": 7,
//   "8": 8,
//   "9": 9,
//   T: 10,
//   J: 11,
//   Q: 12,
//   K: 13,
//   A: 14,
// };

const cardValues = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  T: 10,
  J: 1,
  Q: 12,
  K: 13,
  A: 14,
};

const handTypes = {
  high: 0,
  pair: 1,
  "two pair": 2,
  "three of a kind": 3,
  "full house": 4,
  "four of a kind": 5,
  "five of a kind": 6,
};

type Hand = {
  cards: string;
  cardCounts: Record<string, number>;
  wager: number;
  handType: keyof typeof handTypes;
  handValue: number;
};

function parseLine(line: string, wild: boolean): Hand {
  const [cards, wager] = line.split(" ");

  const cardCounts = cards.split("").reduce((acc, cur) => {
    if (cur in acc) {
      acc[cur] += 1;
    } else {
      acc[cur] = 1;
    }
    return acc;
  }, {});

  const handType = wild
    ? determineWildHand(cardCounts)
    : determineHand(cardCounts);

  return {
    cards,
    cardCounts,
    wager: Number(wager),
    handType,
    handValue: handTypes[handType],
  };
}

function determineHand(
  cardCounts: Record<string, number>,
): keyof typeof handTypes {
  const values = Object.values(cardCounts);
  if (values.length === 5) {
    return "high";
  } else if (values.length === 4) {
    return "pair";
  } else if (values.length === 3) {
    if (values.includes(3)) {
      return "three of a kind";
    } else {
      return "two pair";
    }
  } else if (values.length === 2) {
    if (values.includes(4)) {
      return "four of a kind";
    } else {
      return "full house";
    }
  } else {
    return "five of a kind";
  }
}

function determineWildHand(
  cardCounts: Record<string, number>,
): keyof typeof handTypes {
  const hasWild = "J" in cardCounts;
  if (!hasWild) return determineHand(cardCounts);

  const values = Object.values(cardCounts);
  if (cardCounts["J"] === 4 || cardCounts["J"] === 5) {
    return "five of a kind";
  } else if (cardCounts["J"] === 3) {
    if (values.length === 2) {
      return "five of a kind";
    } else {
      return "four of a kind";
    }
  } else if (cardCounts["J"] === 2) {
    if (values.length === 4) {
      return "three of a kind";
    } else if (values.length === 3) {
      return "four of a kind";
    } else if (values.length === 2) {
      return "five of a kind";
    }
  } else if (cardCounts["J"] === 1) {
    if (values.length === 5) {
      return "pair";
    } else if (values.length === 4) {
      return "three of a kind";
    } else if (values.length === 3) {
      if (values.includes(2)) {
        return "full house";
      } else {
        return "four of a kind";
      }
    } else {
      return "five of a kind";
    }
  }
}

function sortHands(a: Hand, b: Hand) {
  if (a.handValue === b.handValue) {
    // sort by cards
    for (let i = 0; i < a.cards.length; i++) {
      if (cardValues[a.cards[i]] < cardValues[b.cards[i]]) {
        return -1;
      } else if (cardValues[a.cards[i]] > cardValues[b.cards[i]]) {
        return 1;
      }
    }
    return 0;
  } else if (a.handValue < b.handValue) {
    return -1;
  } else {
    return 1;
  }
}

async function part1(): Promise<number> {
  const lines = await getInput(7);

  const hands: Hand[] = [];

  for (const line of lines) {
    const hand = parseLine(line, false);
    hands.push(hand);
  }

  hands.sort(sortHands);

  let total = 0;
  for (let i = 0; i < hands.length; i++) {
    total += hands[i].wager * (i + 1);
  }

  return total;
}

async function part2(): Promise<number> {
  const lines = await getInput(7);

  const hands: Hand[] = [];

  for (const line of lines) {
    const hand = parseLine(line, true);
    hands.push(hand);
  }

  hands.sort(sortHands);

  let total = 0;
  for (let i = 0; i < hands.length; i++) {
    total += hands[i].wager * (i + 1);
  }

  // console.log(hands);

  return total;
}

// part1().then(console.log);
part2().then(console.log);
