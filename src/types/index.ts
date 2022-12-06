export interface AppState {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
  localSongs: SongList;
  downloadableSongs: SongList;
  isProcessing: boolean;
  setLocalSongs: (songs: SongList) => void;
  setDownloadableSongs: (songs: SongList) => void;
  songUploading: (key: string) => void;
  songUploaded: (key: string) => void;
  songDownloading: (key: string) => void;
  songDownloaded: (key: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
}

export interface Song {
  artist: string;
  track: string;
  isUploading: boolean;
  isUploaded: boolean;
  isDownloading: boolean;
  isDownloaded: boolean;
  directory?: string;
  parentDirectory?: string;
  isChorus?: boolean;
  onClick?: (song: string | ChorusSong) => void;
  albumArt?: string;
}

export interface DirectLinks {
  [key: string]: string;
}

export interface ChorusSong {
  id: number;
  name: string;
  artist: string;
  album: string;
  genre: string;
  year: string;
  charter: string;
  length: number;
  effectiveLength: number;
  tierBand: number;
  tierGuitar: number;
  tierBass: number;
  tierRhythm: number;
  tierDrums: number;
  tierVocals: number;
  tierKeys: number;
  tierGuitarghl: number;
  tierBassghl: number;
  diffGuitar: number;
  diffBass: number;
  diffRhythm: number;
  diffDrums: number;
  diffKeys: number;
  diffGuitarghl: number;
  diffGassghl: number;
  isPack: boolean;
  hasForced: boolean;
  hasTap: boolean;
  hasSections: boolean;
  hasStarPower: boolean;
  hasSoloSections: boolean;
  is120: boolean;
  hasStems: boolean;
  hasVideo: boolean;
  hasLyrics: boolean;
  hasNoAudio: boolean;
  needsRenaming: boolean;
  isFolder: boolean;
  hasBrokenNotes: boolean;
  hasBackground: boolean;
  lastModified: string;
  uploadedAt: string;
  link: string;
  directLinks: DirectLinks;
}

export interface ChorusSongList {
  songs: Array<ChorusSong>;
}

export type SongList = Array<Song>;
