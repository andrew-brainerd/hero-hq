import { useContext, useEffect, useState } from 'preact/hooks';
import cn from 'classnames';
import { appDataDir, join } from '@tauri-apps/api/path';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { invoke } from '@tauri-apps/api/tauri';
import HeroContext from '../../context';
import { Song as SongProps } from '../../types';
import { UPLOAD_SONG, DOWNLOAD_SONG } from '../../constants/rust';
import { notify } from '../../utils/log';
import { getBucketKey } from '../../utils/songs';

import './Song.css';

const defaultAlbumArt =
  'https://images.radiox.co.uk/images/68311?crop=16_9&width=660&relax=1&signature=6KC8hEFQyelQ2dSZqTHVWfVucr4=';

const Song = (props: SongProps) => {
  const { artist, track, directory, isUploading, isUploaded, isDownloading } = props;

  const [albumArtSrc, setAlbumArtSrc] = useState(defaultAlbumArt);
  const { songUploading, songUploaded, songDownloading, songDownloaded } = useContext(HeroContext);

  useEffect(() => {
    getAlbumArtSrc().then(src => setAlbumArtSrc(src));
  }, [track]);

  const upload = async (bucketKey: string) => {
    const appDataDirPath = await appDataDir();
    const outputFile = `${appDataDirPath}\\${bucketKey}`;

    songUploading(bucketKey);
    await invoke<string>(UPLOAD_SONG, { directory, outputFile, key: bucketKey }).then(uploadedKey => {
      songUploaded(uploadedKey);
      notify({ title: 'Song Uploaded', body: uploadedKey });
    });
  };

  const download = async (bucketKey: string) => {
    songDownloading(bucketKey);
    await invoke<string>(DOWNLOAD_SONG, { directory, key: bucketKey }).then(downloadedKey => {
      songDownloaded(downloadedKey);
      notify({ title: 'Song Downloaded', body: downloadedKey });
    });
  };

  const getAlbumArtSrc = async () => {
    if (!directory) return '';

    const filePath = await join(directory, 'album.png');

    let albumArt = defaultAlbumArt;

    try {
      console.log('Getting art at', filePath);
      albumArt = convertFileSrc(filePath);
    } catch (e) {
      console.log('Error happened');
    }

    return albumArt;
  };

  return (
    <div className={cn('song', { uploading: isUploading }, { uploaded: isUploaded }, { downloading: isDownloading })}>
      <div className={'album-art'}>
        <img src={albumArtSrc} alt={'Album Art'} />
      </div>
      <div className={'album-info'}>
        <div className={'track'}>{track}</div>
        <div className={'Artist'}>{artist}</div>
      </div>
      <div className={'controls'}>
        <button
          className={'control'}
          onClick={() => (props.isUploaded ? download(getBucketKey(props)) : upload(getBucketKey(props)))}
        >
          {props.isUploaded ? 'Download' : 'Upload'}
        </button>
      </div>
    </div>
  );
};

export default Song;
