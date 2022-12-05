import { createContext } from 'preact';
import { AppState } from '../types';

const { log } = window.console;

const initialState = {
  isSettingsOpen: false,
  setIsSettingsOpen: () => {
    log('setIsSettingsOpen');
  },
  localSongs: [],
  downloadableSongs: [],
  isProcessing: false,
  setLocalSongs: () => {
    log('setLocalSongs');
  },
  setDownloadableSongs: () => {
    log('setDownloadableSongs');
  },
  songUploading: () => {
    log('songUploading');
  },
  songUploaded: () => {
    log('songUploaded');
  },
  songDownloading: () => {
    log('songDownloading');
  },
  songDownloaded: () => {
    log('songDownloaded');
  },
  setIsProcessing: () => {
    log('setIsProcessing');
  }
} as AppState;

const HeroContext = createContext(initialState);

export default HeroContext;
