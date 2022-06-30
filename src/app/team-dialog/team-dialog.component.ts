import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Country } from '../interfaces/country';
import { take } from 'rxjs/operators';
import { Team } from '../interfaces/team';
import { TeamService } from '../services/team.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-team-dialog',
  templateUrl: './team-dialog.component.html',
  styleUrls: ['./team-dialog.component.scss']
})
export class TeamDialogComponent implements OnInit {
  @Input() team!: Team;
  @Output() closeDialog: EventEmitter<boolean> = new EventEmitter(); //por medio de eventos

  public countries = Object.keys(Country).map((key, index, array) => ({
    label: key,
    key: (<any>Country)[key],
  }));


  constructor(
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.teamService
      .getTeam()
      .pipe(take(1))
      .subscribe((team) => {
        if (team.length > 0) {
          this.team = team[0];
        }
      });
  }

  private newTeam(teamFormValue: any) {
    const key = this.teamService.addTeam(teamFormValue).key;
    // const teamFormValueKey = {
    //   ...teamFormValue,
    //   key,
    // };
    // const formattedTeam = {
    //   ...this.team,
    //   players: [
    //     ...(this.team.players ? this.team.players : []),
    //     playerFormValueKey,
    //   ],
    // };
    //this.teamService.addTeam(teamFormValueKey);
  }

  private editTeam(teamFormValue: any) {

    const teamFormValueKey = { ...teamFormValue, $key: this.team.$key };

    const teamFormValueWithFormattedKey = {
      ...teamFormValue,
      key: this.team.$key,
    };

    delete teamFormValueWithFormattedKey.$key;

    // // const modifiedTeam = this.team
    // //   ? this.team.map((team) => {
    // //       return team.$key === this.team.$key
    // //         ? teamFormValueWithFormattedKey
    // //         : team;
    // //     })
    // //   : this.team;

    // const formattedTeam = {
    //   ...this.team,
    //   players: [
    //     ...(modifiedPlayers
    //       ? modifiedPlayers
    //       : [playerFormValueWithFormattedKey]),
    //   ],
    // };
    this.teamService.editTeam(teamFormValueKey);
    //this.teamService.editTeam(formattedTeam);
  }

  onSubmit(teamForm: NgForm) {
    const teamFormValue = { ...teamForm.value };
    teamFormValue.players = [];

    if (this.team && teamForm.valid) {
      this.editTeam(teamFormValue);
    } else {
      this.newTeam(teamFormValue);
    }
    setTimeout(() => {
      window.location.replace('#');
    });
    //window.location.replace('#');
  }

  onClose() {
    this.closeDialog.emit(true);
  }
}
