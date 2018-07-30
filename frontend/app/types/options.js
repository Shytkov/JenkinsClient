// @flow
export type optionsStateType = {
  +urls: Array<optionsUrlType>
};
  
export type optionsUrlType = {
  +id: string,
  +url: string,
  +name: string,
  +loading: boolean,
  +error: string,
  +jobs: Array<optionsJobType>
};

export type optionsJobType = {
  +id: string,
  +included: boolean,
  +name: string
};