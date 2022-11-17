export interface AppState {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
  localSongs: SongList;
  setLocalSongs: (songs: SongList) => void;
  songUploaded: (key: string) => void;
}
export interface Song {
  directory: string;
  artist: string;
  track: string;
  parentDirectory: string;
  isUploading: boolean;
  isUploaded: boolean;
  isDownloaded: boolean;
}

export type SongList = Array<Song>;
