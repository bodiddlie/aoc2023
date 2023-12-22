import { getSampleInput, getInput } from "../util";

type Rule = {
  lhs: string;
  op: string;
  rhs: number;
  result: string;
};

type Part = Record<string, number>;

class RuleProcessor {
  public rules: Rule[];
  public fallback: string;

  constructor(
    public name: string,
    ruleString: string,
  ) {
    const vals = ruleString.split(",");
    this.fallback = vals.pop();
    this.rules = vals.map((val) => {
      const [rule, result] = val.split(":");
      const lhs = rule.substring(0, 1);
      const op = rule.substring(1, 2);
      const rhs = parseInt(rule.substring(2));
      return { lhs, op, rhs, result };
    });
  }

  process(part: Part): string {
    for (const rule of this.rules) {
      if (rule.op === "<") {
        if (part[rule.lhs] < rule.rhs) return rule.result;
      } else {
        if (part[rule.lhs] > rule.rhs) return rule.result;
      }
    }

    return this.fallback;
  }
}

type ProcessorMap = Record<string, RuleProcessor>;

async function part1(): Promise<number> {
  // const input = await getSampleInput(19);
  const input = await getInput(19);

  const index = input.findIndex((line) => line === "");
  const rules = input.slice(0, index);
  const partSpecs = input.slice(index + 1);

  const processors: ProcessorMap = {};

  for (const rule of rules) {
    const bracketIndex = rule.indexOf("{");
    const name = rule.substring(0, bracketIndex);
    const ruleString = rule.substring(bracketIndex + 1, rule.length - 1);
    const processor = new RuleProcessor(name, ruleString);
    processors[name] = processor;
  }

  const parts: Part[] = [];
  for (const p of partSpecs) {
    const part: Part = {};
    for (const props of p.substring(1, p.length - 1).split(",")) {
      const [key, val] = props.split("=");
      part[key] = parseInt(val);
    }
    parts.push(part);
  }

  const accepted: Part[] = [];
  const rejected: Part[] = [];

  for (const part of parts) {
    let result = processors["in"].process(part);
    while (result !== "A" && result !== "R") {
      result = processors[result].process(part);
    }

    if (result === "A") {
      accepted.push(part);
    } else {
      rejected.push(part);
    }
  }

  let total = 0;

  for (const part of accepted) {
    for (const key in part) {
      total += part[key];
    }
  }
  return total;
}

type Range = {
  x: [number, number];
  m: [number, number];
  a: [number, number];
  s: [number, number];
  result: string;
};

function processRange(range: Range, processors: ProcessorMap): Range[] {
  const processor = processors[range.result];
  const nextRanges: Range[] = [];

  for (const rule of processor.rules) {
    if (rule.op === "<") {
      if (range[rule.lhs][1] <= rule.rhs) {
        range.result = rule.result;
        nextRanges.push(range);
        break;
      } else if (range[rule.lhs][0] < rule.rhs) {
        const clone = JSON.parse(JSON.stringify(range)) as Range;
        clone[rule.lhs][1] = rule.rhs;
        clone.result = rule.result;
        nextRanges.push(clone);
        range[rule.lhs][0] = rule.rhs;
      }
    } else if (rule.op === ">") {
      if (range[rule.lhs][0] > rule.rhs) {
        range.result = rule.result;
        nextRanges.push(range);
        break;
      } else if (range[rule.lhs][1] > rule.rhs + 1) {
        const clone = JSON.parse(JSON.stringify(range)) as Range;
        clone[rule.lhs][0] = rule.rhs + 1;
        clone.result = rule.result;
        nextRanges.push(clone);
        range[rule.lhs][1] = rule.rhs + 1;
      }
    }
  }

  range.result = processor.fallback;

  nextRanges.push(range);

  return nextRanges;
}

function getAcceptedByRanges(processors: ProcessorMap) {
  const ranges: Range[] = [
    {
      x: [1, 4001],
      m: [1, 4001],
      a: [1, 4001],
      s: [1, 4001],
      result: "in",
    },
  ];

  const accepted: Range[] = [];

  while (ranges.length > 0) {
    const range = ranges.pop();

    const next = processRange(range, processors).filter((r) => {
      if (r.result === "R") return false;
      if (r.result === "A") {
        accepted.push(r);
        return false;
      }
      return true;
    });
    ranges.push(...next);
  }

  return accepted;
}

async function part2(): Promise<number> {
  // const input = await getSampleInput(19);
  const input = await getInput(19);

  const index = input.findIndex((line) => line === "");
  const rules = input.slice(0, index);

  const processors: ProcessorMap = {};

  for (const rule of rules) {
    const bracketIndex = rule.indexOf("{");
    const name = rule.substring(0, bracketIndex);
    const ruleString = rule.substring(bracketIndex + 1, rule.length - 1);
    const processor = new RuleProcessor(name, ruleString);
    processors[name] = processor;
  }

  return getAcceptedByRanges(processors)
    .map(({ x, m, a, s }) => {
      return (x[1] - x[0]) * (m[1] - m[0]) * (a[1] - a[0]) * (s[1] - s[0]);
    })
    .reduce((a, b) => a + b, 0);
}

// part1().then(console.log);
part2().then(console.log);
