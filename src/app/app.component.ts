import { Component, OnInit } from '@angular/core';
import { BoardService } from './board/board.service';
import { ToastrService } from 'ngx-toastr';
import { Board } from '../app/board/board';

declare const Pusher: any;
const NUM_PLAYERS = 2;
const BOARD_SIZE = 6;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'nerbattleshipwars';

  pusherChannel: any;
  canPlay: boolean = true;
  player: number = 0;
  players: number = 0;
  gameId: string = '';
  // validPlayer: boolean = true;
  gameUrl: string =
    location.protocol +
    '//' +
    location.hostname +
    (location.port ? ':' + location.port : '');
  // boards: any;
  // winner: any;

  constructor(
    private boardServices: BoardService,
    private toastr: ToastrService
  ) {
    this.createBoards();
    this.initPusher();
    this.listenForChanges();
    //this.players = members.count;
    // this.setPlayer(this.players);
    // this.toastr.success('Success', 'Connected!');
    // this.validPlayer = true;
    // this.initPusher();
    // this.listenForChanges();
  }
  ngOnInit(): void {}

  initPusher(): AppComponent {
    let id = this.getQueryParam('id');

    if (!id) {
      id = this.getUniqueId();

      location.search = location.search ? '&id=' + id : '?id=' + id;
    }
    this.gameId = id;
    //TODO PUSHER_APP_KEY
    const pusher = new Pusher('8fcd545629b68a2e1fa3', {
      authEndpoint: 'http://localhost:3000/pusher/auth',
      cluster: 'us2',
    });

    this.pusherChannel = pusher.subscribe(this.gameId);
    this.pusherChannel.bind('pusher:member_added', (member: any) => {
      this.players++;
    });

    this.pusherChannel.bind('pusher:subscription_succeeded', (member: any) => {
      this.players = member.count;
      this.setPlayer(this.players);
      this.toastr.success('Success', 'Connectado!');
    });

    this.pusherChannel.bind('pusher:member_removed', (member: any) => {
      this.players--;
    });

    return this;
  }

  listenForChanges() {
    this.pusherChannel.bind('client-fire', (board: Board) => {
      this.canPlay = !this.canPlay;
      this.boards[board.player.id] = board;

      // this.boards[this.player].player.score = board.player.score || 0;
      //this.boards[board.player].score = board.player.score;
      // this.boards[board.player] = board.player;
      // this.boards[board.player.id].player.score = board.player.score;
      this.boards[this.player].player.score =
        this.boards[this.player].player.score;
    });
  }

  setPlayer(players: number = 0) {
    this.player = players - 1;

    if (players == 1) {
      this.canPlay = true;
    } else if (players == 2) {
      this.canPlay = false;
    }
  }

  fireTorpedo(e: any) {
    let id = e.target.id,
      boardId = id.substring(1, 2),
      row = id.substring(2, 3),
      col = id.substring(3, 4),
      tile = this.boards[boardId].tiles[row][col];

    if (!this.checkValidHit(boardId, tile)) {
      return;
    }
    if (tile.value == 1) {
      console.log(tile.value);

      this.toastr.success('You got this.', 'HURRAAA! YOU SANK A SHIP!');

      this.boards[boardId].tiles[row][col].status = 'win';
      this.boards[boardId].player.score++;

      //debugger;
      // this.boards[this.player].player.score =
      //   (this.boards[this.player].player.score || 0) + 1;
      // debugger;
      // this.boards[this.player] = {
      //   ...this.boards[this.player],
      //   player: {
      //     ...this.boards[this.player].player,
      //     score: this.boards[this.player].player.score + 1,
      //   },
      // };
    } else {
      this.toastr.info('Keep trying fam.', 'OOPS! YOU MISSED THIS TIME');

      this.boards[boardId].tiles[row][col].status = 'fail';
    }
    this.canPlay = false;

    this.boards[boardId].tiles[row][col].used = true;

    this.boards[boardId].tiles[row][col].value = 'X';

    this.pusherChannel.trigger('client-fire', {
      player: this.player,
      score: this.boards[boardId].player.score,
      boardId: boardId,
      board: this.boards[boardId],
    });
  }

  createBoards() {
    for (let i = 0; i < NUM_PLAYERS; i++)
      this.boardServices.createBoard(BOARD_SIZE);
  }

  checkValidHit(boardId: number, tile: any): boolean {
    console.log(boardId, this.player);

    if (boardId == this.player) {
      this.toastr.error(
        "Don't commit suicide.",
        "You can't hit your own board."
      );
      return false;
    }
    if (this.winner) {
      this.toastr.error('Game is over');
      return false;
    }
    if (!this.canPlay) {
      this.toastr.error('A bit too eager.', "It's not your turn to play.");
      return false;
    }
    if (tile.value == 'X') {
      this.toastr.error("Don't waste your torpedos.", 'You already shot here.');
      return false;
    }
    return true;
  }

  getQueryParam(name: string) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  getUniqueId() {
    return 'presence-' + Math.random().toString(36).substr(2, 8);
  }

  get boards(): Board[] {
    return this.boardServices.getBoard();
  }

  get winner() {
    const board = this.boards.find(
      (board) => board.player?.score >= BOARD_SIZE
    );
    return !!board ? board : null;
  }

  get validPlayer(): boolean {
    return this.players >= NUM_PLAYERS;
  }
}
