import {RNG} from "../RNG";
import Constants from "./Constants";


export class GridNode {
  r: number;
  c: number;

  state: number;
  nextState: number;
  daysInState: number;

  linked: boolean;
  mediaOutlet: boolean;
  specialDegree: number|null;
  dead: boolean;

  isolating: boolean;

  rng: RNG;

  constructor(rng: RNG, r: number, c: number) {
    this.r = r;
    this.c = c;

    this.state = Constants.SUSCEPTIBLE;
    this.nextState = Constants.SUSCEPTIBLE;
    this.daysInState = 0;

    this.linked = false;
    this.mediaOutlet = false;
    this.specialDegree = null;
    this.dead = false;

    this.isolating = false;

    this.rng = rng;
  }

  getState(): number {
    return this.state;
  }

  getNextState(): number {
    return this.nextState;
  }

  isSusceptible(): boolean {
    return this.state === Constants.SUSCEPTIBLE;
  }

  isExposed(): boolean {
    return this.state === Constants.EXPOSED;
  }

  isInfected(): boolean {
    return this.state === Constants.INFECTED;
  }

  canInfectOthers(): boolean {
    return this.state === Constants.EXPOSED || this.state === Constants.INFECTED;
  }

  isRemoved(): boolean {
    return this.state === Constants.REMOVED;
  }

  isDead(): boolean {
    return this.state === Constants.DEAD;
  }

  isAllowedToBeRemoved(): boolean {
    return !this.linked;
  }

  _setState(state: number) {
    this.state = state;
  }

  setNextState(state: number) {
    this.nextState = state;
  }

  setSusceptible() {
    this._setState(Constants.SUSCEPTIBLE)
  }

  setExposed() {
    this._setState(Constants.EXPOSED)
  }

  setInfected() {
    this._setState(Constants.INFECTED)
  }

  setRemoved() {
    this._setState(Constants.REMOVED)
  }

  setDead() {
    this._setState(Constants.DEAD)
  }

  startDay() {
    this.nextState = this.state
  }

  isIsolating(): boolean {
    return this.isolating;
  }

  tryToInfect(neighbor: GridNode, transProb: number) {
    if (!neighbor.isSusceptible()) {
      // Can't get infected
      return;
    }

    // Test to see if neighbor should get active
    let infect = this.rng.random() < transProb;
    if (infect) {
      let actuallyInfect = true;
      if (actuallyInfect) {
        neighbor.setNextState(Constants.EXPOSED);
      }
    }
  }

  maybeIsolate(chanceOfIsolationAfterSymptoms: number) {
    if (this.rng.random() < chanceOfIsolationAfterSymptoms) {
      this.isolating = true;
    }
  }

  endDay(overHospitalCapacity: boolean,
         daysIncubating: number,
         daysSymptomatic: number,
         allowDeaths: boolean,
         deathRate: number,
         chanceOfIsolationAfterSymptoms: number) {
    if (this.nextState !== this.state) {
      if (this.nextState === Constants.EXPOSED && daysIncubating === 0) {
        this.nextState = Constants.INFECTED;
        this.maybeIsolate(chanceOfIsolationAfterSymptoms);
      }

      this._setState(this.nextState);
      this.daysInState = 0;
    } else {
      this.daysInState++;

      if (this.isExposed()) {
        if (this.daysInState >= daysIncubating) {
          this.setInfected();
          this.maybeIsolate(chanceOfIsolationAfterSymptoms);
          this.daysInState = 0;
        }
      } else if (this.isInfected()) {
        if (this.daysInState >= daysSymptomatic) {
          if (overHospitalCapacity) {
            deathRate = deathRate * 2;
          }
          if (!allowDeaths) {
            deathRate = 0;
          }

          if (this.rng.random() < deathRate) {
            this.setDead();
          } else {
            this.setRemoved();
          }

          this.daysInState = 0;
        }
      }
    }
  }
}
