import { getSampleInput, getInput } from "../util";

type NumberMap = {
  num: string;
  startIndex: number;
  endIndex: number;
  row: number;
};

function buildNumberMap(lines: string[]) {
  const numberMap: NumberMap[] = [];

  for (let row = 0; row < lines.length; row++) {
    let num = "";
    const line = lines[row];
    for (let i = 0; i < line.length; i++) {
      if (isNaN(parseInt(line[i])) && num.length > 0) {
        numberMap.push({
          num,
          startIndex: i - num.length,
          endIndex: i - 1,
          row,
        });
        num = "";
      } else if (!isNaN(parseInt(line[i]))) {
        num += line[i];
      }
    }
    if (num.length > 0) {
      numberMap.push({
        num,
        startIndex: line.length - num.length,
        endIndex: line.length - 1,
        row,
      });
    }
  }

  return numberMap;
}

function checkAdjacent(numberMap: NumberMap[], lines: string[]): NumberMap[] {
  const adjacentNumbers: NumberMap[] = [];

  for (const num of numberMap) {
    let adjacent = false;

    //check left and right
    if (
      lines[num.row][num.startIndex - 1] &&
      lines[num.row][num.startIndex - 1] !== "."
    ) {
      adjacent = true;
    }

    if (!adjacent) {
      if (
        lines[num.row][num.endIndex + 1] &&
        lines[num.row][num.endIndex + 1] !== "."
      ) {
        adjacent = true;
      }
    }

    //check above
    if (!adjacent) {
      const above = lines[num.row - 1];
      if (above) {
        const start = Math.max(0, num.startIndex - 1);
        const end = Math.min(num.endIndex + 1, above.length - 1);
        const touching = above
          .slice(start, end + 1)
          .split("")
          .filter((char) => char !== "." || !isNaN(parseInt(char)));
        adjacent = touching.length > 0;
      }
    }

    //check below
    if (!adjacent) {
      const below = lines[num.row + 1];
      if (below) {
        const start = Math.max(0, num.startIndex - 1);
        const end = Math.min(num.endIndex + 1, below.length - 1);
        const touching = below
          .slice(start, end + 1)
          .split("")
          .filter((char) => char !== "." || !isNaN(parseInt(char)));
        adjacent = touching.length > 0;
      }
    }

    if (adjacent) {
      adjacentNumbers.push(num);
    }
  }

  return adjacentNumbers;
}

async function partOne(): Promise<number> {
  const lines = await getInput(3);

  const numberMap = buildNumberMap(lines);
  console.table(numberMap);
  const adjacentNumbers = checkAdjacent(numberMap, lines);

  return adjacentNumbers.reduce((acc, cur) => acc + parseInt(cur.num), 0);
}

type GearMap = {
  row: number;
  index: number;
};

function buildGearMap(lines: string[]) {
  const gearMap: GearMap[] = [];

  for (let row = 0; row < lines.length; row++) {
    const line = lines[row];
    for (let i = 0; i < line.length; i++) {
      if (line[i] === "*") {
        gearMap.push({ row, index: i });
      }
    }
  }

  return gearMap;
}

async function partTwo(): Promise<number> {
  const lines = await getInput(3);

  const numberMap = buildNumberMap(lines);
  const adjacentNumbers = checkAdjacent(numberMap, lines);
  const gears = buildGearMap(lines);

  let total = 0;

  for (const possibleGear of gears) {
    const touchingNumbers: NumberMap[] = [];
    for (const num of adjacentNumbers) {
      if (
        num.row === possibleGear.row &&
        (num.startIndex - 1 === possibleGear.index ||
          num.endIndex + 1 === possibleGear.index)
      ) {
        touchingNumbers.push(num);
      } else if (
        num.row - 1 === possibleGear.row &&
        num.startIndex - 1 <= possibleGear.index &&
        num.endIndex + 1 >= possibleGear.index
      ) {
        touchingNumbers.push(num);
      } else if (
        num.row + 1 === possibleGear.row &&
        num.startIndex - 1 <= possibleGear.index &&
        num.endIndex + 1 >= possibleGear.index
      ) {
        touchingNumbers.push(num);
      }
    }

    if (touchingNumbers.length === 2) {
      total +=
        parseInt(touchingNumbers[0].num) * parseInt(touchingNumbers[1].num);
    }
  }

  return total;
}

// partOne().then(console.log);
partTwo().then(console.log);
