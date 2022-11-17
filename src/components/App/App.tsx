import { useState } from 'preact/hooks';
import cn from 'classnames';
import HeroContext from '../../context';
import { Song, SongList } from '../../types';
import VIEWS from '../../constants/views';
import Settings from '../Settings/Settings';
import Upload from '../Upload/Upload';
import Download from '../Download/Download';

import './App.css';
import { getBucketKey } from '../../utils/songs';

export const App = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedView, setSelectedView] = useState('upload');
  const [localSongs, setLocalSongs] = useState<SongList>([]);

  const songUploaded = (uploadedKey: string) => {
    setLocalSongs(localSongs.filter(song => getBucketKey(song) !== uploadedKey));
  };

  return (
    <HeroContext.Provider value={{ isSettingsOpen, setIsSettingsOpen, localSongs, setLocalSongs, songUploaded }}>
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
