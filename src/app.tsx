import { useState } from 'preact/hooks';
import { open } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';
import cn from 'classnames';
import './app.css';

interface Song {
  directory: string;
  artist: string;
  track: string;
  parentDirectory: string;
  isUploading?: boolean;
  isUploaded?: boolean;
}

const isValidSong = (song: Song) => !!song.track && !song.artist.includes('Guitar Hero');

const parseSongDir = (parent: string, directory: string): Song => {
  // Example: 'H:\\Games\\clonehero-win64\\songs\\Audioslave - Exploder'
  const songData = directory.split('\\')[4].split('-');
  const artist = songData[0]?.trim();
  const track = songData[1]?.trim();

  return { directory, artist, track, parentDirectory: parent };
};

const getSongs = (parent: string, songDirectories: Array<string>) => songDirectories.map(sd => parseSongDir(parent, sd)).filter(isValidSong);

export function App<FC>() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [songDirectory, setSongDirectory] = useState<string>('');
  const [songList, setSongList] = useState<Array<Song>>([]);

  const openDialog = async () => {
    const directory = (await open({
      directory: true,
      multiple: false
    })) as string;

    if (directory && directory.includes('clonehero') && directory.includes('songs')) {
      await invoke<Array<string>>('get_local_songs', { directory }).then(songDirectories => {
        console.log('Setting song directory to ', directory);
        setSongDirectory(directory);
        setSongList(getSongs(directory, songDirectories));
        setErrorMessage('');
      });
    } else {
      setSongList([]);
      setErrorMessage('Invalid songs directory provided. Please try again.');
    }
  };

  const uploadSong = async (parentDirectory: string, songDirectory: string, filename: string) => {
    // const outputPath = `${parentDirectory}\\${filename}`;
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
    const outputPath = `C:\\Users\\drwb3\\hero-hq\\${filename}`;
    console.log('Generating Zip File at', outputPath);
    await invoke<string>('upload_song', { directory: songDirectory, filename: outputPath, key: filename }).then(zip => {
      console.log('Zip File:', zip);
      setTimeout(() => {
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
      }, 1000);
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
