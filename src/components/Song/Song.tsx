import { useContext } from 'preact/hooks';
import cn from 'classnames';
import { sendNotification } from '@tauri-apps/api/notification';
import { appDataDir } from '@tauri-apps/api/path';
import { invoke } from '@tauri-apps/api/tauri';
import HeroContext from '../../context';
import { Song as SongProps } from '../../types';
import { UPLOAD_SONG, DOWNLOAD_SONG } from '../../constants/rust';
import { getBucketKey } from '../../utils/songs';

import './Song.css';

const Song = (props: SongProps) => {
  const { artist, track, directory, isUploading, isUploaded } = props;

  const { songUploaded, songDownloaded } = useContext(HeroContext);

  const upload = async (key: string) => {
    const appDataDirPath = await appDataDir();
    const outputFile = `${appDataDirPath}\\${key}`;

    await invoke<string>(UPLOAD_SONG, { directory, outputFile, key }).then(uploaded => {
      songUploaded(uploaded);
      sendNotification({ title: 'Song Uploaded', body: uploaded });
    });
  };

  const download = async (bucketKey: string) => {
    await invoke<string>(DOWNLOAD_SONG, { key: bucketKey }).then(downloaded => {
      songDownloaded(downloaded);
      sendNotification({ title: 'Song Downloaded', body: downloaded });
    });
  };

  return (
    <div
      className={cn('song', { uploading: isUploading }, { uploaded: isUploaded })}
      onClick={() => (props.isUploaded ? download(getBucketKey(props)) : upload(getBucketKey(props)))}
    >
      {artist} - {track}
    </div>
  );
};

export default Song;
