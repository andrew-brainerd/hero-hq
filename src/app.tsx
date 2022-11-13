import { useState } from 'preact/hooks';
import preactLogo from './assets/preact.svg';
import { open } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';
import './app.css';

interface Song {
  artist: string;
  track: string;
}

const isValidSong = (song: Song) => !!song.track && !song.artist.includes('Guitar Hero');

const parseSongDir = (directory: string): Song => {
  // Example: 'H:\\Games\\clonehero-win64\\songs\\Audioslave - Exploder'
  const songData = directory.split('\\')[4].split('-');
  const artist = songData[0]?.trim();
  const track = songData[1]?.trim();

  return { artist, track };
};

const getSongs = (songDirectories: Array<string>) => songDirectories.map(sd => parseSongDir(sd)).filter(isValidSong);

export function App<FC>() {
  const [greetMsg, setGreetMsg] = useState<string>('');
  const [songList, setSongList] = useState<Array<Song>>([]);

  const openDialog = async () => {
    const directory = await open({
      directory: true,
      multiple: false
    });

    if (directory) {
      console.log('Selected', directory);
      await invoke<Array<string>>('open_songs_dir', { directory }).then(songDirectories => {
        console.clear();
        setSongList(getSongs(songDirectories));
      });
    }
  };

  return (
    <div class="container">
      <div class="row">
        <div>
          <button type="button" onClick={() => openDialog()}>
            Select Songs Directory
          </button>
        </div>
      </div>
      <div class="song-list">
        {songList.map(song => (
          <div className={'song'}>
            {song.artist} - {song.track}
          </div>
        ))}
      </div>
    </div>
  );
}
