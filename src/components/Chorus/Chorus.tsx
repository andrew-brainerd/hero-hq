import { useState } from 'preact/hooks';
import cn from 'classnames';
import { invoke } from '@tauri-apps/api/tauri';
import { ChorusSong, ChorusSongList, DirectLinks } from '../../types';
import { SEARCH_CHORUS_SONGS, DOWNLOAD_CHORUS_FILE, CLEANUP_ARCHIVE_FILES } from '../../constants/rust';
import { getSongDirectory } from '../../utils/store';
import Song from '../Song/Song';

import './Chorus.css';

const getFilename = (link: string) => {
  switch (link) {
    case 'album':
      return 'album.png';
    case 'chart':
      return 'notes.chart';
    case 'ini':
      return 'song.ini';
    default:
      return link;
  }
};

const getCount = (str: string, text: string) => {
  const textIndex = str.indexOf(text);
  const stringValue = str.substring(textIndex + text.length, textIndex + text.length + 2).trim();

  return parseInt(stringValue);
};

const getAlbumArt = (links: DirectLinks) => {
  const albumLink = Object.keys(links).find(link => link.includes('album.'));

  return albumLink ? links[albumLink].replace('&export=download', '') : undefined;
};

const Chorus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [songList, setSongList] = useState<Array<ChorusSong>>([]);

  const searchChorus = async (query: string) => {
    setIsLoading(true);
    await invoke<ChorusSongList>(SEARCH_CHORUS_SONGS, { query }).then(({ songs }) => {
      setSongList(songs);
      setIsLoading(false);
    });
  };

  const download = async (song: ChorusSong) => {
    for (const link of Object.keys(song.directLinks)) {
      const url = song.directLinks[link];
      const songDirectory = await getSongDirectory();
      const directory = `${songDirectory}\\${song.artist} - ${song.name}`;
      const filename = getFilename(link);
      const isArchive = link === 'archive';

      console.log('Downloading File', { url, directory, filename, isArchive });

      await invoke<string>(DOWNLOAD_CHORUS_FILE, { url, directory, filename, archived: isArchive }).then(
        async output => {
          console.log('Download output', output);

          if (output.includes('7-Zip')) {
            const folderCount = getCount(output, 'Folders: ');
            const fileCount = getCount(output, 'Files: ');

            console.log({ folderCount, fileCount });

            if (folderCount > 0) {
              // copy files to song "root"
              await invoke(CLEANUP_ARCHIVE_FILES, { directory }).then(output => {
                console.log(output);
              });
            }
          }
        }
      );
    }
  };

  return (
    <div className={'chorus'}>
      <div className={cn('row', 'search')}>
        <input
          type="text"
          placeholder={'Song, Artist, Genre, etc.'}
          onChange={e => setSearchTerm((e.target as HTMLInputElement).value)}
          value={searchTerm}
        />
        <button onClick={() => searchChorus(searchTerm)}>Search</button>
      </div>
      {isLoading ? (
        <div className={'loading'}>Loading...</div>
      ) : (
        <div className={'container'}>
          {songList.map(song => {
            const songData = {
              track: song.name,
              artist: song.artist,
              isUploading: false,
              isUploaded: false,
              isDownloading: false,
              isDownloaded: false,
              isChorus: true,
              albumArt: '' //getAlbumArt(song.directLinks)
            };

            console.log('Chorus Song', song);

            return <Song {...songData} onClick={() => download(song)} />;
          })}
        </div>
      )}
    </div>
  );
};

export default Chorus;
