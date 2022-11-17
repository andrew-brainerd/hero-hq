import { useState } from 'preact/hooks';
import { open } from '@tauri-apps/api/dialog';
import { sendNotification } from '@tauri-apps/api/notification';
import { invoke } from '@tauri-apps/api/tauri';
import { SongList } from '../../types';
import { GET_ALL_SONGS, UPLOAD_SONG } from '../../constants/rust';
import store, { saveSongDirectory } from '../../utils/store';
import Song from '../Song/Song';
import { getLocalSongs } from '../../utils/songs';

const Upload = () => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [songList, setSongList] = useState<SongList>([]);

  const openDialog = async () => {
    const directory = (await open({
      directory: true,
      multiple: false
    })) as string;

    openSongDirectory(directory);
  };

  const openSongDirectory = async (directory: string) => {
    if (directory && directory.includes('clonehero') && directory.includes('songs')) {
      await invoke<Array<Array<string>>>(GET_ALL_SONGS, { directory }).then(([songDirectories, uploadedSongs]) => {
        saveSongDirectory(directory);
        setSongList(getLocalSongs(directory, songDirectories, uploadedSongs));
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

    console.log('Uploading song...', outputPath);

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

    await invoke<string>(UPLOAD_SONG, { directory: songDirectory, filename: outputPath, key: filename }).then(
      uploaded => {
        sendNotification({ title: 'Song Uploaded', body: uploaded });
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
      }
    );
  };

  const loadSettings = async () => {
    setIsLoading(true);
    const savedSongDirectory = (await store.get('songDirectory')) as string;
    if (isInitialLoad && savedSongDirectory && songList.length === 0) {
      openSongDirectory(savedSongDirectory);
      setIsInitialLoad(false);
      setIsLoading(false);
    }
  };

  loadSettings();

  return (
    <div className={'upload'}>
      {errorMessage ? <div className={'error'}>{errorMessage}</div> : null}
      <div class="row">
        {(!isInitialLoad && !isLoading && songList.length === 0) || errorMessage ? (
          <div className={'song-select'}>
            <button type="button" onClick={() => openDialog()}>
              Select Songs Directory
            </button>
          </div>
        ) : null}
      </div>
      {songList
        .filter(song => !song.isUploaded)
        .map(songData => (
          <Song {...songData} onClick={uploadSong} />
        ))}
    </div>
  );
};

export default Upload;
