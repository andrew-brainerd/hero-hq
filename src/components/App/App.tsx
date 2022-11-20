import { useEffect, useState } from 'preact/hooks';
import { checkUpdate, installUpdate, onUpdaterEvent, UpdateResult } from '@tauri-apps/api/updater';
import cn from 'classnames';
import HeroContext from '../../context';
import { SongList } from '../../types';
import VIEWS from '../../constants/views';
import { notify } from '../../utils/log';
import { getBucketKey } from '../../utils/songs';
import Settings from '../Settings/Settings';
import Upload from '../Upload/Upload';
import Download from '../Download/Download';

import './App.css';

export const App = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedView, setSelectedView] = useState('upload');
  const [localSongs, setLocalSongs] = useState<SongList>([]);
  const [downloadableSongs, setDownloadableSongs] = useState<SongList>([]);

  const checkAppUpdate = async () => {
    console.log('Checking for app update...');

    const unlisten = await onUpdaterEvent(({ error, status }) => {
      if (error) {
        notify({ title: 'Updater event', body: `Error: ${error}` });
      }

      if (status) {
        notify({ title: 'Updater event', body: `Status: ${status}` });
      }
    });

    const update = await checkUpdate();

    console.log('Update', update);
    if (update?.shouldUpdate) {
      notify({
        title: 'Updating App',
        body: `Installing update ${update.manifest?.version}, ${update.manifest?.date}, ${update.manifest?.body}`
      });
      // await installUpdate();
    }
  };

  const songUploading = (uploadingKey: string) => {
    setLocalSongs(
      localSongs.map(song => (getBucketKey(song) === uploadingKey ? { ...song, isUploading: true } : song))
    );
  };

  const songUploaded = (uploadedKey: string) => {
    setLocalSongs(localSongs.filter(song => getBucketKey(song) !== uploadedKey));
  };

  const songDownloaded = (downloadedKey: string) => {
    setDownloadableSongs(downloadableSongs.filter(song => getBucketKey(song) !== downloadedKey));
  };

  useEffect(() => {
    checkAppUpdate();
  }, []);

  const context = {
    isSettingsOpen,
    localSongs,
    downloadableSongs,
    setIsSettingsOpen,
    setLocalSongs,
    setDownloadableSongs,
    songUploading,
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
