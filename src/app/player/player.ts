export class Player {
  id!: number;
  score: number = 0;

  constructor(value: Object = {}) {
    Object.assign(this, value);
  }
}
