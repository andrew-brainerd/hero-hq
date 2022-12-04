import { useContext, useState } from 'preact/hooks';
import { open } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';
import HeroContext from '../../context';
import { GET_ALL_SONGS } from '../../constants/rust';
import { getSongDirectory, saveSongDirectory } from '../../utils/store';
import { getLocalSongs, getDownloadableSongs } from '../../utils/songs';

interface SettingsProps {
  isOpen: boolean;
  close: () => void;
}

const Settings = ({ isOpen, close }: SettingsProps) => {
  const { setLocalSongs, setDownloadableSongs } = useContext(HeroContext);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const openDialog = async () => {
    const directory = (await open({
      directory: true,
      multiple: false
    })) as string;

    openSongDirectory(directory);
  };

  const openSongDirectory = async (directory: string) => {
    if (directory && directory.includes('hero') && directory.includes('songs')) {
      await invoke<Array<Array<string>>>(GET_ALL_SONGS, { directory }).then(
        async ([songDirectories, uploadedSongs]) => {
          const myLocalSongs = getLocalSongs(directory, songDirectories, uploadedSongs);
          const myDownloadableSongs = getDownloadableSongs(directory, myLocalSongs, uploadedSongs);

          await saveSongDirectory(directory);
          setLocalSongs(myLocalSongs);
          setDownloadableSongs(myDownloadableSongs);
          setErrorMessage('');
          close();
        }
      );
    } else {
      setLocalSongs([]);
      setErrorMessage('Invalid songs directory provided. Please try again.');
    }
  };

  const loadSettings = async () => {
    const savedSongDirectory = await getSongDirectory();
    if (isInitialLoad && savedSongDirectory) {
      openSongDirectory(savedSongDirectory);
      setIsInitialLoad(false);
    }
  };

  loadSettings();

  return isOpen ? (
    <div className={'settings'}>
      {errorMessage ? <div className={'error'}>{errorMessage}</div> : null}
      <div class="row">
        <div className={'song-select'}>
          <button type="button" onClick={() => openDialog()}>
            Select Songs Directory
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default Settings;
