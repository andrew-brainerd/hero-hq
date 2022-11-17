import { useContext } from 'preact/hooks';
import { sendNotification } from '@tauri-apps/api/notification';
import { invoke } from '@tauri-apps/api/tauri';
import { UPLOAD_SONG } from '../../constants/rust';
import Song from '../Song/Song';
import HeroContext from '../../context';

const Upload = () => {
  const { localSongs, songUploaded } = useContext(HeroContext);

  const uploadSong = async (parentDirectory: string, songDirectory: string, filename: string) => {
    // const outputPath = `${parentDirectory}\\${filename}`;
    const outputPath = `C:\\Users\\drwb3\\hero-hq\\${filename}`;

    await invoke<string>(UPLOAD_SONG, { directory: songDirectory, filename: outputPath, key: filename }).then(
      async uploaded => {
        songUploaded(uploaded);
        sendNotification({ title: 'Song Uploaded', body: uploaded });
      }
    );
  };

  return (
    <div className={'upload'}>
      {localSongs
        .filter(song => !song.isUploaded)
        .map(songData => (
          <Song {...songData} onClick={uploadSong} />
        ))}
    </div>
  );
};

export default Upload;
