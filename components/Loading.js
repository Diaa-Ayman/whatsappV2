import { Circle } from 'better-react-spinkit';
function Loading() {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        height: '100vh',
      }}
    >
      <Circle size='80px' color='#46c254' />
    </div>
  );
}

export default Loading;
