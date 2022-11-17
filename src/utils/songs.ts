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

export const getRemoteSongData = (sd: string): void => {
  console.log('Remote Song', sd);
};

export const getLocalSongs = (parent: string, songDirectories: Array<string>, uploadedSongs: Array<string>) =>
  songDirectories.map(sd => getLocalSongData(parent, sd, uploadedSongs)).filter(isValidSong);

export const getRemoteSongs = (uploadedSongs: Array<string>) => uploadedSongs.map(sd => getRemoteSongData(sd));

export const getBucketKey = (song: Song) => `${song.artist} - ${song.track}.zip`;
