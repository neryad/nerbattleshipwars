import { Injectable } from '@angular/core';
import { Player } from '../player/player';

import { Board } from './board';
export interface Tiles {
  used: boolean;
  value: number;
  status: string;
}
//TODO Refactor
@Injectable({
  providedIn: 'root',
})
export class BoardService {
  playerId = 1;
  board: Board[] = [];

  // tiles: Tiles[] = [];

  constructor() {}

  createBoard(size: number = 5) {
    //crear el board
    let tiles: Tiles[][] = [];
    for (let i = 0; i < size; i++) {
      tiles[i] = [];
      for (let j = 0; j < size; j++) {
        tiles[i][j] = { used: false, value: 0, status: 'empty' };
      }
    }

    // generate Radom ships on board
    for (let i = 0; i < size * 2; i++) {
      tiles = this.randomShips(tiles, size);
      // console.log(tiles, 'tiles');
    }

    //create board
    let board = new Board({
      player: new Player({ id: this.playerId++ }),
      tiles: tiles,
    });
    // let board = new Board();

    //add board to array
    this.board.push(board);
    return this;
  }
  //generate radon ships
  randomShips(board: Tiles[][], len: number): Tiles[][] {
    // console.log('hola');

    len = len - 1;
    let ranRow = this.getRadomInt(0, len),
      ranCol = this.getRadomInt(0, len);

    if (board[ranRow][ranCol].value == 1) {
      // console.log('hola2');
      return this.randomShips(board, len);
    } else {
      board[ranRow][ranCol].value = 1;
      // console.log('hola3');
      return board;
    }
  }

  getRadomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //get board
  getBoard() {
    // console.log(this.board, 'board');

    return this.board;
  }
}
