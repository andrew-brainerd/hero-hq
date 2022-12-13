import { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { exists } from '@tauri-apps/api/fs';
import { appDataDir, join } from '@tauri-apps/api/path';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { invoke } from '@tauri-apps/api/tauri';
import HeroContext from '../../context';
import { Song as SongProps } from '../../types';
import { UPLOAD_SONG, DOWNLOAD_SONG } from '../../constants/rust';
import { notify } from '../../utils/log';
import { getBucketKey } from '../../utils/songs';
import Loading from '../Loading/Loading';

import './Song.css';

const defaultAlbumArt =
  'https://images.radiox.co.uk/images/68311?crop=16_9&width=660&relax=1&signature=6KC8hEFQyelQ2dSZqTHVWfVucr4=';

const Song = (props: SongProps) => {
  const { artist, track, directory, isUploading, isUploaded, isDownloading, isDownloaded, isChorus } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [albumArtSrc, setAlbumArtSrc] = useState(defaultAlbumArt);
  const { isProcessing, songUploading, songUploaded, songDownloading, songDownloaded, setIsProcessing } =
    useContext(HeroContext);

  useEffect(() => {
    if (isDownloaded) {
      getAlbumArtSrc().then(src => {
        setAlbumArtSrc(src);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      });
    } else if (isChorus && props.albumArt) {
      setAlbumArtSrc(props.albumArt);
    }
  }, [track]);

  const upload = async (bucketKey: string) => {
    const appDataDirPath = await appDataDir();
    const outputFile = `${appDataDirPath}\\${bucketKey}`;

    setIsProcessing(true);
    setIsLoading(true);
    songUploading(bucketKey);

    await invoke<string>(UPLOAD_SONG, { directory, outputFile, key: bucketKey }).then(uploadedKey => {
      setIsProcessing(false);
      songUploaded(uploadedKey);
      setIsLoading(false);
      notify({ title: 'Song Uploaded', body: uploadedKey });
    });
  };

  const download = async (bucketKey: string) => {
    setIsProcessing(true);
    setIsLoading(true);
    songDownloading(bucketKey);

    await invoke<string>(DOWNLOAD_SONG, { directory, key: bucketKey }).then(downloadedKey => {
      setIsProcessing(false);
      songDownloaded(downloadedKey);
      notify({ title: 'Song Downloaded', body: downloadedKey });
    });
  };

  const getAlbumArtSrc = async () => {
    if (!directory) return '';

    const filePath = await join(directory, 'album.png');
    const fileSrc = convertFileSrc(filePath);

    return (await exists(filePath)) ? fileSrc : defaultAlbumArt;
  };

  const handleClick = () => {
    if (props.isUploaded) {
      download(getBucketKey(props));
    } else {
      upload(getBucketKey(props));
    }
  };

  return (
    <div className={cn('song', { uploading: isUploading }, { uploaded: isUploaded }, { downloading: isDownloading })}>
      {!props.isUploaded ? (
        <div className={'album-art'}>
          <img src={albumArtSrc} alt={'Album Art'} />
        </div>
      ) : null}
      <div className={'album-info'}>
        <div className={'track'}>{track}</div>
        <div className={'artist'}>{artist}</div>
      </div>
      {isLoading ? (
        <div className={'song-loading'}>
          <Loading size={75} />
        </div>
      ) : (
        <div className={'controls'}>
          <button
            className={'control'}
            onClick={() => (props.onClick ? props.onClick(props.track) : handleClick())}
            disabled={isProcessing}
          >
            {props.isUploaded || props.isChorus ? 'Download' : 'Upload'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Song;
