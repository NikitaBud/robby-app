import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommandsService {

  constructor() { }

  getCommands(field: string, power: number) {  // function
    const side = Math.sqrt(field.length);
    const bestSoFar = { path: [], powerUsed: Infinity };
    let pathsConsidered = 0;
    const robby = {
      position: zToXy(field.indexOf('S'), side),
      orientation: [0,1],
      path: [],
      powerUsed: 0
    };

    const t = zToXy(field.indexOf('T'), side);

    function move(robby, field) {
      const distToT = getDist(robby.position, t).dist;
      if (0 === distToT) {
        if (bestSoFar.powerUsed > robby.powerUsed) {
          bestSoFar.path = robby.path;
          bestSoFar.powerUsed = robby.powerUsed;
          pathsConsidered++;
        }
        return;
      }
      if (robby.powerUsed + distToT >= Math.min(power + 1, bestSoFar.powerUsed)) {
        pathsConsidered++;
        return;
      }

      const nextMoves = getNextMoves(robby, field);
      if (0 === nextMoves.length) {
        pathsConsidered++;
        return;
      }

      nextMoves.forEach(aMove => {
        const turnCommands = getTurnsRequired(robby.orientation, aMove.direction);
        const newRobby = {
          position: aMove.newPosition,
          orientation: aMove.direction,
          powerUsed: robby.powerUsed + turnCommands.length + 1,
          path: robby.path.concat(turnCommands, 'f')
        };

        const previousLocation = xyToZ(robby.position, side);
        const newField = field.slice(0,previousLocation).concat('#', field.slice(previousLocation + 1));

        move(newRobby, newField);
      });
    }

    move(robby, field);

    return bestSoFar.path;

    function xyToZ(xy, side) {
      return xy[0] + (side - xy[1] - 1) * side;
    }

    function zToXy(z, side) {
      return [z % side, side - Math.floor(z / side) - 1];
    }

    function getDist(startXy, endXy) {
      return {
        dist: Math.abs(endXy[0] - startXy[0]) + Math.abs(endXy[1] - startXy[1]),
        steps: [endXy[0] - startXy[0]  ,   endXy[1] - startXy[1]]
      };
    }

    function getNextMoves(robby, field) {
      const side = Math.sqrt(field.length);
      const moves = [];
      const moveDirections = [ [-1, 0], [0, 1], [1, 0], [0, -1] ];

      moveDirections.forEach( move => {
        const newPosition = [robby.position[0] + move[0], robby.position[1] + move[1]];
        const charAtNewPos = field[xyToZ(newPosition, side)];

        if (!validCoord(newPosition,side)) {
          return;
        }

        if ('#' === charAtNewPos) {
          return;
        }

        moves.push({
          newPosition: newPosition,
          direction: move
        });
      });

      moves.sort((moveA, moveB) => {
        const slope = (t[1] - robby.position[1]) / (t[0] - robby.position[0]);
        return getDist(moveA.newPosition, t).dist - getDist(moveB.newPosition, t).dist;
      });

      return moves;
    }

    function validCoord(xy, side) {
      return !(xy[0] < 0 || xy[1] < 0 || xy[0] > side-1 || xy[1] > side-1);
    }

    function getTurnsRequired(orientation, proposedMove) {
      const orientationDeg = degreesFromXy(orientation);
      const moveDeg = degreesFromXy(proposedMove);
      const degChangeRequired = (moveDeg - orientationDeg + 360) % 360;

      const turnCommandPossibilities = {
        0: [],
        90: ['l'],
        180: ['r', 'r'],
        270: ['r']
      };

      return turnCommandPossibilities[degChangeRequired];
    }

    function degreesFromXy(xy) {
      if(xy.join(',') === '-1,0') {
        return 180;
      }

      return ((Math.atan(xy[1] / xy[0]) / (Math.PI*2) * 360) + 360) % 360;
    }
  }
}
