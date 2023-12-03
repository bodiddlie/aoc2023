import { getInput, getSampleInput } from "../util";

const words = [
  { str: "one", val: 1 },
  { str: "two", val: 2 },
  { str: "three", val: 3 },
  { str: "four", val: 4 },
  { str: "five", val: 5 },
  { str: "six", val: 6 },
  { str: "seven", val: 7 },
  { str: "eight", val: 8 },
  { str: "nine", val: 9 },
  { str: "1", val: 1 },
  { str: "2", val: 2 },
  { str: "3", val: 3 },
  { str: "4", val: 4 },
  { str: "5", val: 5 },
  { str: "6", val: 6 },
  { str: "7", val: 7 },
  { str: "8", val: 8 },
  { str: "9", val: 9 },
];

async function partOne(): Promise<number> {
  const lines = await getInput(1);

  let result = 0;

  for (const line of lines) {
    let first = NaN;
    let last = NaN;
    let i = 0;
    let j = line.length;

    while ((isNaN(first) || isNaN(last)) && i < line.length) {
      for (const word of words) {
        if (isNaN(first) && line.startsWith(word.str, i)) {
          first = word.val;
        }
        if (isNaN(last) && line.endsWith(word.str, j)) {
          last = word.val;
        }
        if (!isNaN(first) && !isNaN(last)) {
          break;
        }
      }
      i++;
      j--;
    }

    const num = parseInt("" + first + last);
    result += num;
  }

  return result;
}

partOne().then(console.log);
