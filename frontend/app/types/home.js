// @flow
export type homeStateType = {
  +jobs: Array<jobType>
};

export type jobType = {
  +id: string,
  +url: string,
  +joburl: string,
  +name: string,
  +color: string,
  +building: boolean,
  +health: number,
  +group: string
};
