import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Team } from '../interfaces/team';

export const TeamsTableHeaders = ['Name', 'Country', 'Players']

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teamsDB: AngularFireList<Team>;

  constructor(private db: AngularFireDatabase) {
    this.teamsDB = this.db.list('/team', (ref) =>
      ref.orderByChild('name')
    );
  }

  getTeam(): Observable<Team[]> {
    return this.teamsDB.snapshotChanges().pipe(
      map((changes) => {
        return changes.map(
          (c) =>
            ({
              $key: c.key,
              ...c.payload.val(),
            } as Team)
        );
      })
    );
  }

  addTeam(team : Team) {
    return this.teamsDB.push(team);
  }

  editTeam(newTeamData:any) {
    const $keyT = newTeamData.$key;
    delete(newTeamData.$key);
    this.db.list('/team').update($keyT, newTeamData);
    //this.teamsDB.update(key, newTeamData)
  }

  deleteTeam(id: string) {
    this.teamsDB.remove(id);
  }
}
