import { useContext } from 'preact/hooks';
import HeroContext from '../../context';
import Song from '../Song/Song';

const Download = () => {
  const { downloadableSongs } = useContext(HeroContext);

  return (
    <div className={'download'}>
      {downloadableSongs.length ? downloadableSongs.map(songData => <Song {...songData} />) : <h1>No Downloads</h1>}
    </div>
  );
};

export default Download;
