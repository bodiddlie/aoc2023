import { getSampleInput, getInput } from "../util";

type Pulse = 0 | 1;
type Signal = [string, string, Pulse];

interface SignalReceiver {
  modules: string[];
  receive(pulse: Pulse, from: string): Signal[];
}

type ReceiverMap = Map<string, SignalReceiver>;

class Broadcaster implements SignalReceiver {
  constructor(
    public modules: string[],
    public name: string,
  ) {}

  receive(pulse: Pulse, from: string): Signal[] {
    const signals: Signal[] = [];
    for (const module of this.modules) {
      signals.push([module, this.name, pulse]);
    }
    return signals;
  }
}

class FlipModule implements SignalReceiver {
  constructor(
    public modules: string[],
    public name: string,
    public state: boolean = false,
  ) {}
  receive(pulse: Pulse, from: string): Signal[] {
    if (pulse === 1) return [];

    const oldState = this.state;
    this.state = !this.state;
    const signals: Signal[] = [];
    for (const module of this.modules) {
      signals.push([module, this.name, oldState ? 0 : 1]);
    }
    return signals;
  }
}

class ConjunctionModule implements SignalReceiver {
  public pulseMemory: Map<string, Pulse>;
  constructor(
    public modules: string[],
    public name: string,
  ) {
    this.pulseMemory = new Map();
  }

  receive(pulse: Pulse, from: string): Signal[] {
    this.pulseMemory.set(from, pulse);

    const signals: Signal[] = [];
    for (const module of this.modules) {
      const rememberedPulses = new Set(this.pulseMemory.values());
      const pulseToSend =
        rememberedPulses.size === 1
          ? rememberedPulses.values().next().value === 1
            ? 0
            : 1
          : 1;

      this.pulseMemory.set(from, pulse);
      signals.push([module, this.name, pulseToSend]);
    }
    return signals;
  }
}

function parseInput(input: string[]): ReceiverMap {
  const receiverMap: ReceiverMap = new Map();
  for (const line of input) {
    const [from, to] = line.split(" -> ");
    const modules = to.split(", ");

    if (from === "broadcaster") {
      receiverMap.set(from, new Broadcaster(modules, from));
    } else if (from.substring(0, 1) === "%") {
      const name = from.substring(1);
      receiverMap.set(name, new FlipModule(modules, name));
    } else if (from.substring(0, 1) === "&") {
      const name = from.substring(1);
      receiverMap.set(name, new ConjunctionModule(modules, name));
    }
  }

  for (const [name, receiver] of receiverMap) {
    if (receiver instanceof ConjunctionModule) {
      for (const [otherName, otherReceiver] of receiverMap) {
        if (otherReceiver.modules.includes(name)) {
          receiver.pulseMemory.set(otherName, 0);
        }
      }
    }
  }

  return receiverMap;
}

function pushButton(receiverMap: ReceiverMap) {
  let signals = receiverMap.get("broadcaster")!.receive(0, "broadcaster");
  // console.log(signals);

  let lowPulses = 1;
  let highPulses = 0;
  lowPulses += signals.filter(([to, from, pulse]) => pulse === 0).length;
  highPulses += signals.filter(([to, from, pulse]) => pulse === 1).length;
  while (signals.length > 0) {
    const newSignals: Signal[] = [];
    for (const [to, from, pulse] of signals) {
      if (receiverMap.has(to)) {
        newSignals.push(...receiverMap.get(to).receive(pulse, from));
      }
    }
    signals = newSignals;
    lowPulses += signals.filter(([to, from, pulse]) => pulse === 0).length;
    highPulses += signals.filter(([to, from, pulse]) => pulse === 1).length;
    // console.log(signals);
  }

  return [lowPulses, highPulses];
}

async function part1(): Promise<number> {
  // const input = await getSampleInput(20);
  const input = await getInput(20);

  const receiverMap = parseInput(input);

  let lowPulses = 0;
  let highPulses = 0;

  for (let i = 0; i < 1000; i++) {
    const [low, high] = pushButton(receiverMap);
    lowPulses += low;
    highPulses += high;
  }

  console.log(lowPulses, highPulses);
  return lowPulses * highPulses;
}

function detecCycle(receiverMap: ReceiverMap) {}

async function part2(): Promise<number> {
  const input = await getInput(20);

  const receiverMap = parseInput(input);

  let finalFeeder = "";
  for (const [name, receiver] of receiverMap) {
    if (receiver.modules.includes("rx")) {
      finalFeeder = name;
    }
  }

  const seen = new Map<string, number>();

  for (const [name, receiver] of receiverMap) {
    if (receiver.modules.includes(finalFeeder)) {
      seen.set(name, 0);
    }
  }

  console.log(seen);

  let presses = 0;
  const cycleMap = new Map<string, number>();

  let detected = false;
  while (!detected) {
    presses++;
    let signals = receiverMap.get("broadcaster")!.receive(0, "broadcaster");

    while (signals.length > 0) {
      const newSignals: Signal[] = [];
      for (const [to, from, pulse] of signals) {
        if (to === finalFeeder && pulse === 1) {
          seen.set(from, seen.get(from) + 1);

          if (!cycleMap.has(from)) {
            cycleMap.set(from, presses);
          } else {
            if (presses !== seen.get(from) * cycleMap.get(from)) {
              throw new Error("not a cycle, something's fucked");
            }
          }

          const allSeen = Array.from(seen.values());
          detected = allSeen.every((e) => e > 0);
          if (detected) {
            console.log(cycleMap);
          }
        }
        if (receiverMap.has(to)) {
          newSignals.push(...receiverMap.get(to).receive(pulse, from));
        }
      }
      signals = newSignals;
    }
  }

  return 0;
}

// part1().then(console.log);
part2().then(console.log);
