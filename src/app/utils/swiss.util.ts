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
  player1: string;
  player2: string;
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
  standings: Standings[];

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
    this.standings = [];
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
        (item) => `${item.player1} vs ${item.player2}`
      )
    );
  }

  generateDecisionRound(): void {
    const participants = this.sortParticipants();
    if (participants.length % 2 === 0 && this.slots % 2 === 0) return;

    console.log("-------- Decision Round --------");
    this.rounds.push([
      {
        player1: participants[this.slots - 1].name,
        player2: participants[this.slots].name,
      },
    ]);
    this.printRound();
    this.simulateRound(true);
  }

  generateRound(): void {
    const participants = this.filterParticipants();
    if (participants.length < 2) return;

    console.log(`-------- Round ${this.rounds.length + 1} --------`);
    const round: Match[] = [];
    const slices = this.sliceArray(participants);

    for (const slice of slices) {
      const length = slice.length;

      if (this.rounds.length === 0) {
        const middle = Math.floor(length / 2);
        for (let i = 0; i < middle; i++) {
          round.push({
            player1: slice[i].name,
            player2: slice[middle + i].name,
          });
        }
      } else {
        const unpaired = [...slice];
        while (unpaired.length > 1) {
          const player1 = unpaired[0];
          let player2Index = unpaired.length - 1;

          while (
            player2Index > 0 &&
            this.participants[player1.name].opponents.includes(
              unpaired[player2Index].name
            )
          ) {
            player2Index--;
          }

          if (player2Index > 0) {
            const player2 = unpaired[player2Index];
            round.push({ player1: player1.name, player2: player2.name });
            unpaired.splice(player2Index, 1);
            unpaired.shift();
          } else {
            unpaired.shift();
          }
        }
      }
    }

    this.rounds.push(round);
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

  simulateRound(isDecision: boolean): void {
    const roundResults = this.rounds[this.rounds.length - 1].map(
      ({ player1, player2 }) => {
        const winner = Math.random() > 0.5 ? player1 : player2;
        const loser = winner === player1 ? player2 : player1;
        const diff = Math.floor(Math.random() * 10);
        return { won: winner, lost: loser, diff };
      }
    );

    if (!isDecision) this.processResults(roundResults);
    else console.log(`-------- Winner ${roundResults[0].won} --------`);
  }

  simulateTournament(results?: MatchResult[]): void {
    while (this.checkEndCondition()) {
      this.generateRound();
      this.printRound();
      if (!results) this.simulateRound(false);
      else {
        const result = results[this.rounds.length - 1] as any;
        if (result) this.processResults(result);
        else this.simulateRound(false);
      }
      this.standings = this.generateStandings();
    }
    this.generateDecisionRound();
  }
}
