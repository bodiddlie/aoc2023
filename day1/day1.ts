import { getInput } from "../util";

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
];

async function partOne(): Promise<number> {
  try {
    const lines = await getInput(1);

    let result = 0;

    for (const line of lines) {
      let first = NaN;
      let last = NaN;
      let i = 0;

      while (isNaN(first)) {
        for (const word of words) {
          if (line.substring(i, i + word.str.length) === word.str) {
            first = word.val;
            break;
          }
        }
        if (isNaN(first)) {
          first = parseInt(line[i]);
        }
        i++;
      }

      i = line.length - 1;
      while (isNaN(last)) {
        for (const word of words) {
          if (line.substring(i - word.str.length + 1, i + 1) === word.str) {
            last = word.val;
            break;
          }
        }
        if (isNaN(last)) {
          last = parseInt(line[i]);
        }
        i--;
      }

      const num = parseInt("" + first + last);
      result += num;
    }

    return result;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

partOne().then(console.log);
