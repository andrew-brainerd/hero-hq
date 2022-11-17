import { useState } from 'preact/hooks';
import cn from 'classnames';
import views from '../../constants/views';
import Upload from '../Upload/Upload';
import Download from '../Download/Download';

import './App.css';

export const App = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedView, setSelectedView] = useState('upload');

  return (
    <div class="container">
      <div class="row">
        <div className={'open-settings'}>
          <button type="button" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
            Settings
          </button>
        </div>
      </div>
      <div class="row views">
        <div
          className={cn('view', { selected: selectedView === views.UPLOAD })}
          onClick={() => setSelectedView(views.UPLOAD)}
        >
          Upload
        </div>
        <div
          className={cn('view', { selected: selectedView === views.DOWNLOAD })}
          onClick={() => setSelectedView(views.DOWNLOAD)}
        >
          Download
        </div>
      </div>
      <div class="song-list">{selectedView === views.UPLOAD ? <Upload /> : <Download />}</div>
    </div>
  );
};
