import { Player } from '../player/player';

export class Board {
  player!: Player;
  tiles: any[] = [];

  constructor(value: Object = {}) {
    Object.assign(this, value);
  }
}
