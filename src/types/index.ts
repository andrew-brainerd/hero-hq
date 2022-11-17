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
