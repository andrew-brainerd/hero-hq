import { useState } from 'preact/hooks';
import { invoke } from '@tauri-apps/api/tauri';
import { SEARCH_CHORUS_SONGS, DOWNLOAD_CHORUS_FILE } from '../../constants/rust';
import { getSongDirectory } from '../../utils/store';

interface DirectLinks {
  [key: string]: string;
}

interface ChorusSong {
  id: number;
  name: string;
  artist: string;
  album: string;
  genre: string;
  year: string;
  charter: string;
  length: number;
  effectiveLength: number;
  tierBand: number;
  tierGuitar: number;
  tierBass: number;
  tierRhythm: number;
  tierDrums: number;
  tierVocals: number;
  tierKeys: number;
  tierGuitarghl: number;
  tierBassghl: number;
  diffGuitar: number;
  diffBass: number;
  diffRhythm: number;
  diffDrums: number;
  diffKeys: number;
  diffGuitarghl: number;
  diffGassghl: number;
  isPack: boolean;
  hasForced: boolean;
  hasTap: boolean;
  hasSections: boolean;
  hasStarPower: boolean;
  hasSoloSections: boolean;
  is120: boolean;
  hasStems: boolean;
  hasVideo: boolean;
  hasLyrics: boolean;
  hasNoAudio: boolean;
  needsRenaming: boolean;
  isFolder: boolean;
  hasBrokenNotes: boolean;
  hasBackground: boolean;
  lastModified: string;
  uploadedAt: string;
  link: string;
  directLinks: DirectLinks;
}

interface ChorusSongList {
  songs: Array<ChorusSong>;
}

const getFilename = (link: string) => {
  switch (link) {
    case 'album':
      return 'album.png';
    case 'archive':
      return `${link}`;
    case 'chart':
      return 'notes.chart';
    case 'ini':
      return 'song.ini';
    default:
      return link;
  }
};

const Chorus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [songList, setSongList] = useState<Array<ChorusSong>>([]);

  const searchChorus = async (query: string) => {
    setIsLoading(true);
    await invoke<ChorusSongList>(SEARCH_CHORUS_SONGS, { query }).then(({ songs }) => {
      console.log('Search Songs', songs);
      setSongList(songs);
      setIsLoading(false);
    });
  };

  const download = async (song: ChorusSong) => {
    console.log('Downloading Song', song);
    for (const link of Object.keys(song.directLinks)) {
      const url = song.directLinks[link];
      const songDirectory = await getSongDirectory();
      const directory = `${songDirectory}\\${song.artist} - ${song.name}`;
      const filename = getFilename(link);
      const isArchive = link === 'archive';

      console.log('Downloading File', { url, directory, filename, isArchive });

      await invoke<string>(DOWNLOAD_CHORUS_FILE, { url, directory, filename, archived: isArchive }).then(output => {
        console.log('Download output', output);

        if (output.includes('7-Zip')) {
          const foldersText = 'Folders: ';
          const filesText = 'Files: ';
          const folderIndex = output.indexOf(foldersText);
          const fileIndex = output.indexOf(filesText);

          const folderCount = output
            .substring(folderIndex + foldersText.length, folderIndex + foldersText.length + 2)
            .trim();
          const fileCount = output.substring(fileIndex + filesText.length, fileIndex + filesText.length + 2).trim();

          console.log({ folderCount, fileCount });
        }
      });
    }
  };

  return (
    <div className={'chorus'}>
      <div className={'row'}>
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
          {songList.map(song => (
            <>
              <div
                className={'chorus-song'}
                style={{ marginTop: '15px', cursor: 'pointer' }}
                onClick={() => download(song)}
              >
                {song.artist} - {song.name} {!!song.directLinks['archive'] ? '[Archive]' : ''}
              </div>
            </>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chorus;
