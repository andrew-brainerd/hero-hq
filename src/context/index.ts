import { createContext } from 'preact';
import { AppState } from '../types';

const initialState = {
  isSettingsOpen: false,
  setIsSettingsOpen: () => {
    console.log('setIsSettingsOpen');
  },
  localSongs: [],
  downloadableSongs: [],
  setLocalSongs: () => {
    console.log('setLocalSongs');
  },
  setDownloadableSongs: () => {
    console.log('setDownloadableSongs');
  },
  songUploaded: () => {
    console.log('songUploaded');
  },
  songDownloaded: () => {
    console.log('songDownloaded');
  }
} as AppState;

const HeroContext = createContext(initialState);

export default HeroContext;
