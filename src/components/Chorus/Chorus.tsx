import { useEffect, useState } from 'preact/hooks';
import { invoke } from '@tauri-apps/api/tauri';
import useDebounce from '../../hooks/useDebounce';
import { SEARCH_CHORUS_SONGS } from '../../constants/rust';

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
              <a className={'chorus-song'} style={{ marginTop: '15px' }} href={song.link}>
                {song.name}
              </a>
              <div className={'links'}>
                {Object.keys(song.directLinks).map(file => (
                  <div className={'file'}>
                    <a href={song.directLinks[file]}>{file}</a>
                  </div>
                ))}
              </div>
            </>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chorus;
