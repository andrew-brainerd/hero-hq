import { useState } from 'preact/hooks';
import { open } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';
import { Store } from 'tauri-plugin-store-api';
import cn from 'classnames';
import './app.css';

interface Song {
  directory: string;
  artist: string;
  track: string;
  parentDirectory: string;
  isUploading: boolean;
  isUploaded: boolean;
}

const store = new Store('.settings.dat');

const isValidSong = (song: Song) => !!song.track && !song.artist.includes('Guitar Hero');

const parseSongDir = (parent: string, directory: string, uploadedSongs: Array<string>): Song => {
  // Example: 'H:\\Games\\clonehero-win64\\songs\\Audioslave - Exploder'
  const songData = directory.split('\\')[4].split('-');
  const artist = songData[0]?.trim();
  const track = songData[1]?.trim();
  const isUploaded = !!uploadedSongs.find(song => song.includes(artist) && song.includes(track));

  return { directory, artist, track, parentDirectory: parent, isUploading: false, isUploaded };
};

const getSongs = (parent: string, songDirectories: Array<string>, uploadedSongs: Array<string>) => {
  return songDirectories.map(sd => parseSongDir(parent, sd, uploadedSongs)).filter(isValidSong);
};

export function App<FC>() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [songList, setSongList] = useState<Array<Song>>([]);

  const saveSongDirectory = async (directory: string) => {
    await store.set('songDirectory', directory);
  };

  const openDialog = async () => {
    const directory = (await open({
      directory: true,
      multiple: false
    })) as string;

    openSongDirectory(directory);
  };

  const openSongDirectory = async (directory: string) => {
    if (directory && directory.includes('clonehero') && directory.includes('songs')) {
      await invoke<Array<Array<string>>>('get_all_songs', { directory }).then(([songDirectories, uploadedSongs]) => {
        saveSongDirectory(directory);
        setSongList(getSongs(directory, songDirectories, uploadedSongs));
        setErrorMessage('');
      });
    } else {
      setSongList([]);
      setErrorMessage('Invalid songs directory provided. Please try again.');
    }
  };

  const uploadSong = async (parentDirectory: string, songDirectory: string, filename: string) => {
    // const outputPath = `${parentDirectory}\\${filename}`;
    const outputPath = `C:\\Users\\drwb3\\hero-hq\\${filename}`;

    setSongList(
      songList.map(song => {
        if (filename.includes(song.artist) && filename.includes(song.track)) {
          return {
            ...song,
            isUploading: true
          };
        }

        return song;
      })
    );

    await invoke<string>('upload_song', { directory: songDirectory, filename: outputPath, key: filename }).then(zip => {
      setSongList(
        songList.map(song => {
          if (filename.includes(song.artist) && filename.includes(song.track)) {
            return {
              ...song,
              isUploading: false,
              isUploaded: true
            };
          }

          return song;
        })
      );
    });
  };

  const loadSettings = async () => {
    const savedSongDirectory = (await store.get('songDirectory')) as string;
    if (savedSongDirectory && songList.length === 0) {
      openSongDirectory(savedSongDirectory);
    }
  };

  loadSettings();

  return (
    <div class="container">
      <div class="row">
        {true || songList.length === 0 || errorMessage ? (
          <div className={'song-select'}>
            <button type="button" onClick={() => openDialog()}>
              Select Songs Directory
            </button>
          </div>
        ) : null}
      </div>
      {errorMessage ? <div className={'error'}>{errorMessage}</div> : null}
      <div class="song-list">
        {songList.map(song => (
          <div
            className={cn('song', { uploading: song.isUploading }, { uploaded: song.isUploaded })}
            onClick={() => uploadSong(song.parentDirectory, song.directory, `${song.artist} - ${song.track}.zip`)}
          >
            {song.artist} - {song.track}
          </div>
        ))}
      </div>
    </div>
  );
}
