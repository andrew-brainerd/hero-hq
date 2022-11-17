import cn from 'classnames';
import { Song as SongType } from '../../types';

import './Song.css';

interface ComponentProps {
  onClick: (parentDirectory: string, directory: string, bucketKey: string) => Promise<void>;
}

type SongProps = SongType & ComponentProps;

const Song = ({ artist, track, directory, parentDirectory, isUploading, isUploaded, onClick }: SongProps) => {
  const bucketKey = `${artist} - ${track}.zip`;
  return (
    <div
      className={cn('song', { uploading: isUploading }, { uploaded: isUploaded })}
      onClick={() => onClick(parentDirectory, directory, bucketKey)}
    >
      {artist} - {track}
    </div>
  );
};

export default Song;
