import { createContext } from 'preact';
import { AppState } from '../types';

const initialState = {
  isSettingsOpen: false,
  setIsSettingsOpen: () => {},
  localSongs: [],
  setLocalSongs: () => {},
  songUploaded: () => {}
} as AppState;

const HeroContext = createContext(initialState);

export default HeroContext;
