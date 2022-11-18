import { useContext } from 'preact/hooks';
import Song from '../Song/Song';
import HeroContext from '../../context';

const Upload = () => {
  const { localSongs } = useContext(HeroContext);

  return (
    <div className={'upload'}>
      {localSongs
        .filter(song => !song.isUploaded)
        .map(songData => (
          <Song {...songData} />
        ))}
    </div>
  );
};

export default Upload;
