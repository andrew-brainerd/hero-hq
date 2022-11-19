import { useContext } from 'preact/hooks';
import cn from 'classnames';
import { appDataDir } from '@tauri-apps/api/path';
import { invoke } from '@tauri-apps/api/tauri';
import HeroContext from '../../context';
import { Song as SongProps } from '../../types';
import { UPLOAD_SONG, DOWNLOAD_SONG } from '../../constants/rust';
import { notify } from '../../utils/log';
import { getBucketKey } from '../../utils/songs';

import './Song.css';

const Song = (props: SongProps) => {
  const { artist, track, directory, isUploading, isUploaded } = props;

  const { songUploading, songUploaded, songDownloaded } = useContext(HeroContext);

  const upload = async (key: string) => {
    const appDataDirPath = await appDataDir();
    const outputFile = `${appDataDirPath}\\${key}`;

    songUploading(key);
    await invoke<string>(UPLOAD_SONG, { directory, outputFile, key }).then(uploadedKey => {
      songUploaded(uploadedKey);
      notify({ title: 'Song Uploaded', body: uploadedKey });
    });
  };

  const download = async (bucketKey: string) => {
    await invoke<string>(DOWNLOAD_SONG, { directory, key: bucketKey }).then(downloadedKey => {
      songDownloaded(downloadedKey);
      notify({ title: 'Song Downloaded', body: downloadedKey });
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
