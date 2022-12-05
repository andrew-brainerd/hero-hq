import { Song } from '../types';

export const isValidSong = (song: Song) => !!song.track && !song.artist.includes('Guitar Hero');

export const getLocalSongData = (parent: string, localSong: Song, uploadedSongs: Array<string>): Song => {
  const isUploaded = !!uploadedSongs.find(song => song.includes(localSong.artist) && song.includes(localSong.track));

  return {
    directory: localSong.directory,
    artist: localSong.artist,
    track: localSong.track,
    parentDirectory: parent,
    isUploading: false,
    isUploaded,
    isDownloading: false,
    isDownloaded: !isUploaded
  };
};

export const getLocalSongs = (parent: string, songs: Array<Song>, uploadedSongs: Array<string>) =>
  songs.map(song => getLocalSongData(parent, song, uploadedSongs)).filter(isValidSong);

export const getBucketKey = (song: Song) => `${song.artist} - ${song.track}.zip`;

export const getSongFromKey = (directory: string, key: string): Song => {
  const artistAndTrack = key.replace('.zip', '');
  const artist = artistAndTrack.split('-')[0].trim();
  const track = artistAndTrack.split('-')[1].trim();

  return {
    artist,
    track,
    directory,
    isUploading: false,
    isUploaded: true,
    isDownloading: false,
    isDownloaded: false
  };
};

export const getDownloadableSongs = (directory: string, localSongs: Array<Song>, uploadedSongs: Array<string>) =>
  uploadedSongs
    .filter(uploadedSong => !localSongs.find(localSong => getBucketKey(localSong) === uploadedSong))
    .map(downloadKey => getSongFromKey(directory, downloadKey));
