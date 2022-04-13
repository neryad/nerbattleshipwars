import { Component, OnInit } from '@angular/core';
import { BoardService } from './board/board.service';
import { ToastrService } from 'ngx-toastr';
import { Board } from '../app/board/board';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'nerbattleshipwars';

  numPlayer = 2;
  boardSize = 6;
  canPlay: boolean = true;
  player = 0;
  players = 2;

  gameId: string = '';

  gameUrl: string =
    location.protocol +
    '//' +
    location.hostname +
    (location.port ? ':' + location.port : '');
  // boards: any;
  winner: any;

  constructor(
    private boardServices: BoardService,
    private toastr: ToastrService
  ) {
    this.createBoards();

    //this.players = members.count;
    // this.setPlayer(this.players);
    // this.toastr.success('Success', 'Connected!');
    // this.validPlayer = true;
  }
  ngOnInit(): void {}

  setPlayer(players: number = 2): AppComponent {
    this.player = players - 1;

    if (players == 1) {
      this.canPlay = true;
    } else if (players == 2) {
      this.canPlay = false;
    }

    return this;
  }

  fireEnemy(e: any): AppComponent {
    let id = e.target.id;
    let boardId = id.substring(1, 2);
    let row = id.substring(2, 3);
    let col = id.substring(3, 4);

    let tile = this.boards[boardId].tiles[row][col];

    if (!this.checkHit(boardId, tile)) {
      return this;
    }

    if (tile.value == 1) {
      this.toastr.success('Hundiste un barco');
      this.boards[boardId].tiles[row][col].status = 'win';
      this.boards[this.player].player.score++;
    } else {
      this.canPlay = false;
      this.boards[boardId].tiles[row][col].used = true;
      this.boards[boardId].tiles[row][col].value = 'X';
      return this;
    }

    this.canPlay = false;
    this.boards[boardId].tiles[row][col].used = true;
    this.boards[boardId].tiles[row][col].value = 'X';
    return this;
  }
  //TODO verifica
  get validPlayer(): boolean {
    return this.players >= this.numPlayer && this.player < this.numPlayer;
  }
  checkHit(boardId: number, tile: any) {
    if (boardId == this.player) {
      this.toastr.error('No te disparas a ti mismo');
      return false;
    }

    if (this.winner) {
      this.toastr.error('Game over');
      return false;
    }

    if (!this.canPlay) {
      this.toastr.error('No puedes disparar');
      return false;
    }

    if (tile.value == 'X') {
      this.toastr.error('Ya disparaste a ese barco');
      return false;
    }

    return true;
  }

  createBoards(): AppComponent {
    for (let i = 0; i < this.numPlayer; i++)
      this.boardServices.createBoard(this.boardSize);
    console.log(this);

    return this;
  }

  // getWinner(): Board {
  //   return this.boards.find(
  //     (board: any) => board.player.score >= this.boardSize
  //   );
  // }

  getQueryParam(name: string) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  getUniqueId() {
    return 'presence-' + Math.random().toString(36).substr(2, 8);
  }

  get boards(): Board[] | any {
    return this.boardServices.getBoard();
  }
}
