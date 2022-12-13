import { useEffect, useState } from 'react';
import cn from 'classnames';
import HeroContext from '../../context';
import { SongList } from '../../types';
import VIEWS from '../../constants/views';
import { getBucketKey } from '../../utils/songs';
import Settings from '../Settings/Settings';
import Upload from '../Upload/Upload';
import Download from '../Download/Download';
import Chorus from '../Chorus/Chorus';

import './App.css';
import store from '../../utils/store';
import useAsyncEffect from '../../hooks/useAsyncEffect';

export const App = () => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedView, setSelectedView] = useState('upload');
  const [localSongs, setLocalSongs] = useState<SongList>([]);
  const [downloadableSongs, setDownloadableSongs] = useState<SongList>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const getSelectedView = async () => (await store.get('view')) as string;

  useAsyncEffect<string>(async () => {
    const view = await getSelectedView();

    if (isInitialLoad && view) {
      setIsInitialLoad(false);
      setSelectedView(view);
    } else {
      await store.set('view', selectedView);
    }
  }, [selectedView]);

  const songUploading = (uploadingKey: string) => {
    setLocalSongs(
      localSongs.map(song => (getBucketKey(song) === uploadingKey ? { ...song, isUploading: true } : song))
    );
  };

  const songUploaded = (uploadedKey: string) => {
    setLocalSongs(localSongs.filter(song => getBucketKey(song) !== uploadedKey));
  };

  const songDownloading = (downloadingKey: string) => {
    setDownloadableSongs(
      downloadableSongs.map(song => (getBucketKey(song) === downloadingKey ? { ...song, isDownloading: true } : song))
    );
  };

  const songDownloaded = (downloadedKey: string) => {
    setDownloadableSongs(downloadableSongs.filter(song => getBucketKey(song) !== downloadedKey));
  };

  const context = {
    isSettingsOpen,
    localSongs,
    downloadableSongs,
    isProcessing,
    setIsSettingsOpen,
    setLocalSongs,
    setDownloadableSongs,
    songUploading,
    songUploaded,
    songDownloading,
    songDownloaded,
    setIsProcessing
  };

  return (
    <HeroContext.Provider value={context}>
      <div class="container">
        <div class="row">
          <div className={'open-settings'}>
            <button type="button" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
              Settings
            </button>
          </div>
        </div>
        <Settings isOpen={isSettingsOpen} close={() => setIsSettingsOpen(false)} />
        <div class="row views">
          <div
            className={cn('view', { selected: selectedView === VIEWS.UPLOAD })}
            onClick={() => setSelectedView(VIEWS.UPLOAD)}
          >
            Upload
          </div>
          <div
            className={cn('view', { selected: selectedView === VIEWS.DOWNLOAD })}
            onClick={() => setSelectedView(VIEWS.DOWNLOAD)}
          >
            Download
          </div>
          <div
            className={cn('view', { selected: selectedView === VIEWS.CHORUS })}
            onClick={() => setSelectedView(VIEWS.CHORUS)}
          >
            Chorus
          </div>
        </div>
        <div class="song-list">
          {
            {
              [VIEWS.UPLOAD]: <Upload />,
              [VIEWS.DOWNLOAD]: <Download />,
              [VIEWS.CHORUS]: <Chorus />
            }[selectedView]
          }
        </div>
      </div>
    </HeroContext.Provider>
  );
};
