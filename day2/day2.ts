import { getInputPart } from "../util";

function buildGameMap(lines: string[]): Record<string, Record<string, number>> {
  const gameMap = {};

  for (const line of lines) {
    const [game, nums] = line.split(":");
    const gameNum = game.split(" ")[1];
    const pulls = nums.split(";");
    gameMap[gameNum] = {};

    for (const pull of pulls) {
      const colorPull = pull.split(",");
      for (const color of colorPull) {
        const [amount, colorName] = color.trim().split(" ");
        if (
          !gameMap[gameNum][colorName] ||
          gameMap[gameNum][colorName] < parseInt(amount)
        ) {
          gameMap[gameNum][colorName] = parseInt(amount);
        }
      }
    }
  }
  return gameMap;
}

async function partOne(): Promise<number> {
  const MAX_GREEN = 13;
  const MAX_RED = 12;
  const MAX_BLUE = 14;

  const lines = await getInputPart(2, 1);

  const gameMap = buildGameMap(lines);

  let total = 0;
  for (const key in gameMap) {
    if (
      gameMap[key]["green"] <= MAX_GREEN &&
      gameMap[key]["red"] <= MAX_RED &&
      gameMap[key]["blue"] <= MAX_BLUE
    ) {
      total += parseInt(key);
    }
  }
  return total;
}

async function partTwo(): Promise<number> {
  const lines = await getInputPart(2, 1);

  const gameMap = buildGameMap(lines);

  console.log(gameMap);
  let total = 0;
  for (const key in gameMap) {
    total += gameMap[key]["green"] * gameMap[key]["red"] * gameMap[key]["blue"];

    // total += maxGreen * maxRed * maxBlue;
  }
  return total;
}

partOne().then(console.log);
partTwo().then(console.log);
