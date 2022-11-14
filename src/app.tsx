import { useState } from 'preact/hooks';
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
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [songList, setSongList] = useState<Array<Song>>([]);

  const openDialog = async () => {
    const directory = await open({
      directory: true,
      multiple: false
    });

    if (directory && directory.includes('clonehero') && directory.includes('songs')) {
      await invoke<Array<string>>('open_songs_dir', { directory }).then(songDirectories => {
        setSongList(getSongs(songDirectories));
        setErrorMessage('');
      });
    } else {
      setSongList([]);
      setErrorMessage('Invalid songs directory provided. Please try again.');
    }
  };

  const printAwsBuckets = async () => {
    console.log('Printing AWS Buckets...');
    await invoke('get_aws_bucket').then(bucket => {
      console.log('Bucket:', bucket);
    });
  };

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
      <div class="row">
        <div className={'aws-test'} style="margin-top: 25px;">
          <button type="button" onClick={() => printAwsBuckets()}>
            BUCKETS
          </button>
        </div>
      </div>
      {errorMessage ? <div className={'error'}>{errorMessage}</div> : null}
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
