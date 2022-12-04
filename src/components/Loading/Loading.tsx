// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Player } from '@lottiefiles/react-lottie-player';
import equalizer from './equalizer.json';

const Loading = ({ size }) => {
  return (
    <div className={'loading'}>
      <Player autoplay={true} loop={true} src={equalizer} style={{ height: size, width: size }} />
    </div>
  );
};

export default Loading;
