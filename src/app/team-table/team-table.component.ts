import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Team } from '../interfaces/team';
import { TeamService, TeamsTableHeaders } from '../services/team.service';
import { Country } from '../interfaces/country';

@Component({
  selector: 'app-team-table',
  templateUrl: './team-table.component.html',
  styleUrls: ['./team-table.component.scss']
})
export class TeamTableComponent implements OnInit {

  // Variable asincronica $
  // public teams$ : Observable<Team[]> = new Observable<Team[]>();
  public teams$!: Observable<Team[]>;
  public selectedTeam!: Team;
  public showModalTeam = false;
  public showPlayers = false;
  public tableHeaders = TeamsTableHeaders;

  constructor(private teamService: TeamService) { }

  ngOnInit(): void {
    this.teams$ = this.teamService.getTeam();
    // this.teamService
    // .getTeam()
    // .pipe(take(1))
    // .subscribe( (teams) => {
    //   if(teams.length === 0) {
    //     const team: Team = {
    //       name: 'MyAmazingTeam',
    //       country: Country.Argentina,
    //       players: null!
    //     };
    //     this.teamService.addTeam(team);
    //   }
    // })
  }

  newTeam() {
    this.showModalTeam = true;
    this.selectedTeam = null!;
    setTimeout(() => {
      window.location.replace('#open-modal-team');
    });
  }

  editTeam(team: Team) {
    this.selectedTeam = { ...team };
    this.showModalTeam = true;
    setTimeout(() => {
      window.location.replace('#open-modal-team');
    });
  }

  deleteTeam(team: Team) {
    this.teamService
      .getTeam()
      .pipe(take(1))
      .subscribe(teams => {

        this.teamService.deleteTeam(team.$key!);
        
      });
  }

  closeDialog() {
    this.showModalTeam = false;
  }

}
