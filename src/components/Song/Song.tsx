import cn from 'classnames';
import { Song as SongType } from '../../types';
import { getBucketKey } from '../../utils/songs';

import './Song.css';

interface ComponentProps {
  onClick: (parentDirectory: string, directory: string, bucketKey: string) => Promise<void>;
}

type SongProps = SongType & ComponentProps;

const Song = (props: SongProps) => {
  const { artist, track, directory, parentDirectory, isUploading, isUploaded, onClick } = props;
  return (
    <div
      className={cn('song', { uploading: isUploading }, { uploaded: isUploaded })}
      onClick={() => onClick(parentDirectory, directory, getBucketKey(props))}
    >
      {artist} - {track}
    </div>
  );
};

export default Song;
