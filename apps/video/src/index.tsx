import { Composition, registerRoot } from 'remotion';

export const Main = () => {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h1 style={{ color: '#E58A0F', fontSize: 100, fontFamily: 'sans-serif' }}>STEADYWRK</h1>
    </div>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Main"
        component={Main}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};

registerRoot(RemotionRoot);
