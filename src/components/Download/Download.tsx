import { useContext } from 'preact/hooks';
import HeroContext from '../../context';

const Download = () => {
  const { localSongs } = useContext(HeroContext);

  return (
    <div className={'download'}>
      <h1>Download Songs</h1>
    </div>
  );
};

export default Download;
