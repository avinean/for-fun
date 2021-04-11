import { User } from '@doer/entities';

export enum Signs {
  Empty = '',
  Zero = 'zero',
  Cross = 'cross'
}

export interface TikTacToeCell {
  sign: Signs;
  winCell: boolean;
}

export interface Turn {
  x: number;
  y: number;
  sign: Signs;
  ownerId: number;
}

export interface GameMessageData {
  field: TikTacToeCell[][];
  winner: User;
  isGameFinished: boolean;
  turns: Turn[];
}

export interface Data {
  user: User | null;
  inviter: User | null;
  acceptor: User | null;
  isInviter: boolean;
  inviterScore: number;
  acceptorScore: number;
  sign: Signs;
  Signs: typeof Signs;
  closeSign: any;
  circleSign: any;
  defaultAvatar: any;
  turnOwner: number;
  field: TikTacToeCell[][];
  turns: Turn[];
  winner: User | null;
  showWinner: boolean;
  reloadingPercentage: number;
  reloadingTime: number;
}

const getCell = (): TikTacToeCell => ({
  sign: Signs.Empty,
  winCell: false,
});

export const getField = (cellsCount = 3): TikTacToeCell[][] => {
  const template = [...Array(cellsCount)];
  return template.map(() => template.map(() => getCell()));
};

enum Direction {
  ToRight = 0,
  ToBottomRight = 1,
  ToBottom = 2,
  ToBottomLeft = 3
}

export const checkWinner = (field: TikTacToeCell[][], cellsCount = 3):
  [number, number][] => {
  console.log(cellsCount);
  let sign: Signs;
  let x: number;
  let y: number;
  let winningCombo: [number, number][] = [];
  // debugger;

  const moveTo = (direction: Direction = Direction.ToRight) => {
    let localY = y;
    let localX = x;
    const localWinningCombo: [number, number][] = [];

    const right = direction === Direction.ToRight;
    const bottomRight = direction === Direction.ToBottomRight;
    const bottom = direction === Direction.ToBottom;
    const bottomLeft = direction === Direction.ToBottomLeft;

    /*
      this should be refactored for sure
    */

    if (right) {
      for (;localX < cellsCount;) {
        if (field[localY][localX].sign !== sign) return;
        localWinningCombo.push([localY, localX]);
        localX++;
      }
    } else if (bottomRight) {
      for (;localX < cellsCount;) {
        if (field[localY][localX].sign !== sign) return;
        localWinningCombo.push([localY, localX]);
        localX++;
        localY++;
      }
    } else if (bottom) {
      for (;localY < cellsCount;) {
        if (field[localY][localX].sign !== sign) return;
        localWinningCombo.push([localY, localX]);
        localY++;
      }
    } else if (bottomLeft) {
      for (;localY < cellsCount;) {
        if (field[localY][localX].sign !== sign) return;
        localWinningCombo.push([localY, localX]);
        localX -= 1;
        localY++;
      }
    }

    winningCombo = localWinningCombo;
  };

  for (y = 0; y < field.length; y++) {
    if (winningCombo.length) break;
    for (x = 0; x < field[y].length; x++) {
      if (winningCombo.length) break;
      sign = field[y][x].sign;

      // no sense to proceed scenario if cell is empty
      if (sign === Signs.Empty) continue;

      const right = x <= (field[y].length - cellsCount);
      const bottom = y <= (field.length - cellsCount);
      const left = x >= (cellsCount - 1);

      if (right) moveTo();
      if (right && bottom) moveTo(Direction.ToBottomRight);
      if (bottom) moveTo(Direction.ToBottom);
      if (left && bottom) moveTo(Direction.ToBottomLeft);
    }
  }

  console.log(winningCombo);
  if (winningCombo) return winningCombo;
  return [];
};
