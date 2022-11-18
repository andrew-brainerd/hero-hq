import { Song } from '../types';

export const isValidSong = (song: Song) => !!song.track && !song.artist.includes('Guitar Hero');

export const getLocalSongData = (parent: string, directory: string, uploadedSongs: Array<string>): Song => {
  // Example: 'H:\\Games\\clonehero-win64\\songs\\Audioslave - Exploder'
  const songData = directory.split('\\')[4].split('-');
  const artist = songData[0]?.trim();
  const track = songData[1]?.trim();
  const isUploaded = !!uploadedSongs.find(song => song.includes(artist) && song.includes(track));

  return {
    directory,
    artist,
    track,
    parentDirectory: parent,
    isUploading: false,
    isUploaded,
    isDownloaded: !isUploaded
  };
};

export const getLocalSongs = (parent: string, songDirectories: Array<string>, uploadedSongs: Array<string>) =>
  songDirectories.map(sd => getLocalSongData(parent, sd, uploadedSongs)).filter(isValidSong);

export const getBucketKey = (song: Song) => `${song.artist} - ${song.track}.zip`;

export const getSongFromKey = (key: string): Song => {
  const artistAndTrack = key.replace('.zip', '');
  const artist = artistAndTrack.split('-')[0].trim();
  const track = artistAndTrack.split('-')[1].trim();

  return {
    artist,
    track,
    isUploading: false,
    isUploaded: true,
    isDownloaded: false
  };
};

export const getDownloadableSongs = (localSongs: Array<Song>, uploadedSongs: Array<string>) =>
  uploadedSongs
    .filter(uploadedSong => localSongs.find(localSong => getBucketKey(localSong) === uploadedSong))
    .map(downloadKey => getSongFromKey(downloadKey));
