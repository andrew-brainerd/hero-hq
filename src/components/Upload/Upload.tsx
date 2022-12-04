import { useContext, useEffect, useState } from 'preact/hooks';
import cn from 'classnames';
import HeroContext from '../../context';
import Song from '../Song/Song';
import useDebounce from '../../hooks/useDebounce';

import './Upload.css';

const Upload = () => {
  const { localSongs } = useContext(HeroContext);
  const [filter, setFilter] = useState('');
  const [songList, setSongList] = useState(localSongs);
  const debouncedFilter = useDebounce(filter, 750);

  useEffect(() => {
    const formattedFilter = filter.toLocaleLowerCase();
    const updatedSongList = (localSongs || []).filter(
      song =>
        song.artist.toLocaleLowerCase().includes(formattedFilter) ||
        song.track.toLocaleLowerCase().includes(formattedFilter)
    );
    setSongList(updatedSongList);
  }, [localSongs, debouncedFilter]);

  return (
    <div className={'upload'}>
      <div className={cn('row', 'search')}>
        <input
          type="text"
          placeholder={'Song or Artist'}
          onChange={e => setFilter((e.target as HTMLInputElement).value)}
          value={filter}
        />
      </div>
      <div className={'song-list'}>
        {songList
          .filter(song => !song.isUploaded)
          .map(songData => (
            <Song {...songData} />
          ))}
      </div>
    </div>
  );
};

export default Upload;
