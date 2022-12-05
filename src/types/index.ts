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
}

export type SongList = Array<Song>;
