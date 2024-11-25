import { Round } from "app/models/round.model";

type ParticipantData = {
  seed: number;
  wins: number;
  losses: number;
  diff: number;
  buchholz: number;
  opponents: string[];
};

type MatchResult = {
  won: string;
  lost: string;
  diff: number;
};

type Match = {
  p1: string;
  p2: string;
};

type Standings = {
  name: string;
  diff: number;
  wins: number;
  losses: number;
  buchholz: number;
  opponents: string[];
}

export class SwissTournament {
  participants: Record<string, ParticipantData>;
  slots: number;
  rounds: Match[][];
  results: MatchResult[];
  breakpoint: number;

  constructor(participants: string[], slots: number) {
    this.participants = Object.fromEntries(
      participants.map((participant, i) => [
        participant,
        {
          seed: i + 1,
          wins: 0,
          losses: 0,
          diff: 0,
          buchholz: 0,
          opponents: [],
        },
      ])
    );
    this.slots = slots;
    this.rounds = [];
    this.results = [];
    this.breakpoint =
      Math.ceil(Math.log2(Object.keys(this.participants).length)) - 1;
  }

  // Sort participants based on rules (wins, losses, buchholz, seed)
  sortParticipants(): Array<{ name: string } & ParticipantData> {
    return Object.entries(this.participants)
      .sort(([, a], [, b]) => {
        if (a.wins !== b.wins) return b.wins - a.wins;
        if (a.losses !== b.losses) return a.losses - b.losses;
        if (a.buchholz !== b.buchholz) return b.buchholz - a.buchholz;
        return a.seed - b.seed;
      })
      .map(([name, data]) => ({ name, ...data }));
  }

  // Filter participants who have not yet reached the breakpoint
  filterParticipants(): Array<{ name: string } & ParticipantData> {
    return this.sortParticipants().filter(
      (p) => p.wins < this.breakpoint && p.losses < this.breakpoint
    );
  }

  // Group participants by wins-losses
  sliceArray(
    data: Array<{ name: string } & ParticipantData>
  ): Array<Array<{ name: string } & ParticipantData>> {
    const grouped: Record<string, Array<{ name: string } & ParticipantData>> =
      {};

    data.forEach((item) => {
      const key = `${item.wins}-${item.losses}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });

    return Object.values(grouped);
  }

  printRound(): void {
    if (this.rounds.length === 0) return;
    console.log(
      this.rounds[this.rounds.length - 1].map(
        (item) => `${item.p1} vs ${item.p2}`
      )
    );
  }

  // generateDecisionRound(): void {
  //   const participants = this.sortParticipants();
  //   if (participants.length % 2 === 0 && this.slots % 2 === 0) return;

  //   console.log("-------- Decision Round --------");
  //   this.rounds.push([
  //     {
  //       p1: participants[this.slots - 1].name,
  //       p2: participants[this.slots].name,
  //     },
  //   ]);
  //   this.printRound();
  // }

  generateRound(): Match[] {
    const participants = this.filterParticipants();
    if (participants.length < 2) return [];

    console.log(`-------- Round ${this.rounds.length + 1} --------`);
    const matches: Match[] = [];
    const slices = this.sliceArray(participants);

    for (const slice of slices) {
      const length = slice.length;

      if (this.rounds.length === 0) {
        const middle = Math.floor(length / 2);
        for (let i = 0; i < middle; i++) {
          matches.push({
            p1: slice[i].name,
            p2: slice[middle + i].name,
          });
        }
      } else {
        const unpaired = [...slice];
        while (unpaired.length > 1) {
          const p1 = unpaired[0];
          let p2Index = unpaired.length - 1;

          while (
            p2Index > 0 &&
            this.participants[p1.name].opponents.includes(
              unpaired[p2Index].name
            )
          ) {
            p2Index--;
          }

          if (p2Index > 0) {
            const p2 = unpaired[p2Index];
            matches.push({ p1: p1.name, p2: p2.name });
            unpaired.splice(p2Index, 1);
            unpaired.shift();
          } else {
            unpaired.shift();
          }
        }
      }
    }

    this.rounds.push(matches);
    return matches;
  }

  calculateBuchholz(): void {
    for (const [name, participant] of Object.entries(this.participants)) {
      participant.buchholz = participant.opponents.reduce((acc, oppName) => {
        const opponent = this.participants[oppName];
        if (opponent) {
          acc += opponent.wins - opponent.losses;
        }
        return acc;
      }, 0);
    }
  }

  processResults(roundResults: MatchResult[]): void {
    roundResults.forEach(({ won, lost, diff }) => {
      const winner = this.participants[won];
      const loser = this.participants[lost];

      winner.wins++;
      winner.diff += diff;
      winner.opponents.push(lost);

      loser.losses++;
      loser.diff -= diff;
      loser.opponents.push(won);
    });

    this.calculateBuchholz();
  }

  checkEndCondition(): boolean {
    return (
      this.rounds.length <
      Math.ceil(Object.keys(this.participants).length / this.breakpoint) - 1
    );
  }

  generateStandings(): Array<Standings> {
    console.log(`-------- Standings --------`);
    return this.sortParticipants().map((p) => ({
      name: p.name,
      wins: p.wins,
      losses: p.losses,
      buchholz: p.buchholz,
      diff: p.diff,
      opponents: p.opponents,
    }));
  }

  // simulateRound(isDecision: boolean): void {
  //   const roundResults = this.rounds[this.rounds.length - 1].map(
  //     ({ p1, p2 }) => {
  //       const winner = Math.random() > 0.5 ? p1 : p2;
  //       const loser = winner === p1 ? p2 : p1;
  //       const diff = Math.floor(Math.random() * 10);
  //       return { won: winner, lost: loser, diff };
  //     }
  //   );

  //   if (!isDecision) this.processResults(roundResults);
  //   else console.log(`-------- Winner ${roundResults[0].won} --------`);
  // }

  // simulateTournament(results?: any): void {
  //   while (this.checkEndCondition()) {
  //     this.generateRound();
  //     this.printRound();
  //     if (!results) this.simulateRound(false);
  //     else {
  //       const result = results[this.rounds.length - 1] as any;
  //       if (result) this.processResults(result);
  //       else this.simulateRound(false);
  //     }
  //     this.standings = this.generateStandings();
  //   }
  //   this.generateDecisionRound();
  // }
}
