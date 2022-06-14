import { Country } from "./country";
import { SquadNumber } from "./squadNumber";

export interface Player {
    $key ?: string;
    name : string;
    lastname : string;
    position : SquadNumber; //string; // Set de datos a elegir
    weight : number ;
    height : number;
    nationality : Country;//string; // Set de datos a elegir
    leftFooted : boolean; 
}