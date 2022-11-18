export interface AppState {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
  localSongs: SongList;
  downloadableSongs: SongList;
  setLocalSongs: (songs: SongList) => void;
  setDownloadableSongs: (songs: SongList) => void;
  songUploaded: (key: string) => void;
  songDownloaded: (key: string) => void;
}
export interface Song {
  artist: string;
  track: string;
  isUploading: boolean;
  isUploaded: boolean;
  isDownloaded: boolean;
  directory?: string;
  parentDirectory?: string;
}

export type SongList = Array<Song>;
