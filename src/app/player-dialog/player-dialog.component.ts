import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Country } from '../interfaces/country';
import { Team } from '../interfaces/team';
import { PlayerService } from '../services/player.service';
import { TeamService } from '../services/team.service';
import { take } from 'rxjs/operators';
import { SquadNumber } from '../interfaces/squadNumber';
import { NgForm } from '@angular/forms';
import { Player } from '../interfaces/player';

@Component({
  selector: 'app-player-dialog',
  templateUrl: './player-dialog.component.html',
  styleUrls: ['./player-dialog.component.scss'],
})

//type key = keyof Country;
export class PlayerDialogComponent implements OnInit {
  @Input() player!: Player;
  @Output() closeDialog: EventEmitter<boolean> = new EventEmitter(); //por medio de eventos

  private team!: Team;
  public countries = Object.keys(Country).map((key, index, array) => ({
    label: key,
    key: (<any>Country)[key],
  }));
  // public countries = Object.keys(Country).map((key) => ({
  //   label: key,
  //   key: (Country as any)[String(key)],
  // }));
  public squadNumber = Object.keys(SquadNumber)
    .slice(Object.keys(SquadNumber).length / 2)
    .map((key) => ({
      label: key,
      key: (<any>SquadNumber)[key],
      //key: SquadNumber[Number(key)],
    }));

  constructor(
    private playerService: PlayerService,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    console.log(this.countries);
    console.log(this.squadNumber);
    this.teamService
      .getTeam()
      .pipe(take(1))
      .subscribe((team) => {
        if (team.length > 0) {
          this.team = team[0];
        }
      });
  }

  private newPlayer(playerFormValue: any) {
    const key = this.playerService.addPlayer(playerFormValue).key;
    const playerFormValueKey = {
      ...playerFormValue,
      key,
    };
    const formattedTeam = {
      ...this.team,
      players: [
        ...(this.team.players ? this.team.players : []),
        playerFormValueKey,
      ],
    };
    this.teamService.editTeam(formattedTeam);
  }

  private editPlayer(playerFormValue: any) {
    const playerFormValueKey = { ...playerFormValue, $key: this.player.$key };
    const playerFormValueWithFormattedKey = {
      ...playerFormValue,
      key: this.player.$key,
    };
    delete playerFormValueWithFormattedKey.$key;
    const modifiedPlayers = this.team.players
      ? this.team.players.map((player) => {
          return player.$key === this.player.$key
            ? playerFormValueWithFormattedKey
            : player;
        })
      : this.team.players;
    const formattedTeam = {
      ...this.team,
      players: [
        ...(modifiedPlayers
          ? modifiedPlayers
          : [playerFormValueWithFormattedKey]),
      ],
    };
    this.playerService.editPlayer(playerFormValueWithFormattedKey);
    this.teamService.editTeam(formattedTeam);
  }

  onSubmit(playerForm: NgForm) {
    const playerFormValue = { ...playerForm.value };
    if (playerForm.valid) {
      playerFormValue.leftFooted =
        playerFormValue.leftFooted === '' ? false : playerFormValue.leftFooted;
    }
    if (this.player) {
      this.editPlayer(playerFormValue);
    } else {
      this.newPlayer(playerFormValue);
    }
    window.location.replace('#');
  }

  onClose() {
    this.closeDialog.emit(true);
  }
}
