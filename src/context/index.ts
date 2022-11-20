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
  songUploading: () => {
    console.log('songUploading');
  },
  songUploaded: () => {
    console.log('songUploaded');
  },
  songDownloading: () => {
    console.log('songDownloading');
  },
  songDownloaded: () => {
    console.log('songDownloaded');
  }
} as AppState;

const HeroContext = createContext(initialState);

export default HeroContext;
