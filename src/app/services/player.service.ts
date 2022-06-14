import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Player } from '../interfaces/player';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private playersDB: AngularFireList<Player>;

  constructor(private db: AngularFireDatabase) {
    this.playersDB = this.db.list('/player', (ref) =>
      ref.orderByChild('name')
    );
  }

  getPlayer(): Observable<Player[]> {
    return this.playersDB.snapshotChanges().pipe(
      map((changes) => {
        return changes.map(
          (c) =>
            ({
              $key: c.key,
              ...c.payload.val(),
            } as Player)
        );
      })
    );
  }


  addPlayer(player : Player) {
    return this.playersDB.push(player);
  }

  editPlayer(newPlayerData:any) {
    const $key = new newPlayerData.$key;
    delete(newPlayerData.$key);
    this.playersDB.update($key, newPlayerData)
  }

  deletePlayer(id: string) {
    this.playersDB.remove(id);
  }

}
