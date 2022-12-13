import { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import HeroContext from '../../context';
import useDebounce from '../../hooks/useDebounce';
import Song from '../Song/Song';

const Download = () => {
  const { downloadableSongs } = useContext(HeroContext);
  const [filter, setFilter] = useState('');
  const [songList, setSongList] = useState(downloadableSongs);
  const debouncedFilter = useDebounce(filter, 750);

  useEffect(() => {
    const formattedFilter = filter.toLocaleLowerCase();
    const updatedSongList = (downloadableSongs || []).filter(
      song =>
        song.artist.toLocaleLowerCase().includes(formattedFilter) ||
        song.track.toLocaleLowerCase().includes(formattedFilter)
    );
    setSongList(updatedSongList);
  }, [downloadableSongs, debouncedFilter]);

  return (
    <div className={'download'}>
      <div className={cn('row', 'search')}>
        <input
          type="text"
          placeholder={'Song or Artist'}
          onChange={e => setFilter((e.target as HTMLInputElement).value)}
          value={filter}
        />
      </div>
      <div className={'song-list'}>
        {songList.length ? songList.map(songData => <Song {...songData} />) : <h1>No Downloads</h1>}
      </div>
    </div>
  );
};

export default Download;
