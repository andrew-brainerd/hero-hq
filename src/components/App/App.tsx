import { useState } from 'preact/hooks';
import cn from 'classnames';
import HeroContext from '../../context';
import { Song, SongList } from '../../types';
import VIEWS from '../../constants/views';
import { getBucketKey, getSongFromKey } from '../../utils/songs';
import Settings from '../Settings/Settings';
import Upload from '../Upload/Upload';
import Download from '../Download/Download';

import './App.css';

export const App = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedView, setSelectedView] = useState('upload');
  const [localSongs, setLocalSongs] = useState<SongList>([]);
  const [downloadableSongs, setDownloadableSongs] = useState<SongList>([]);

  const songUploaded = (uploadedKey: string) => {
    setLocalSongs(localSongs.filter(song => getBucketKey(song) !== uploadedKey));
    // setDownloadableSongs([...downloadableSongs, getSongFromKey(uploadedKey)]);
  };

  const songDownloaded = (downloadedKey: string) => {
    console.log('Downloaded song', downloadedKey);
    // setLocalSongs([...downloadableSongs, getSongFromKey(downloadedKey)]);
    // setDownloadableSongs(downloadableSongs.filter(song => getBucketKey(song) !== getBucketKey(downloadedSong)));
  };

  const context = {
    isSettingsOpen,
    localSongs,
    downloadableSongs,
    setIsSettingsOpen,
    setLocalSongs,
    setDownloadableSongs,
    songUploaded,
    songDownloaded
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
        </div>
        <div class="song-list">{selectedView === VIEWS.UPLOAD ? <Upload /> : <Download />}</div>
      </div>
    </HeroContext.Provider>
  );
};
