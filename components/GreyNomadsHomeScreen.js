import Link from 'next/link';
import p00 from './homeFaceData/part00';
import p01 from './homeFaceData/part01';
import p02 from './homeFaceData/part02';
import p03 from './homeFaceData/part03';
import p04 from './homeFaceData/part04';
import p05 from './homeFaceData/part05';
import p06 from './homeFaceData/part06';
import p07 from './homeFaceData/part07';
import p08 from './homeFaceData/part08';
import p09 from './homeFaceData/part09';
import p10 from './homeFaceData/part10';
import p11 from './homeFaceData/part11';
import p12 from './homeFaceData/part12';
import p13 from './homeFaceData/part13';
import p14 from './homeFaceData/part14';
import p15 from './homeFaceData/part15';

const homeFace = `data:image/webp;base64,${[
  p00, p01, p02, p03, p04, p05, p06, p07,
  p08, p09, p10, p11, p12, p13, p14, p15
].join('')}`;

const hotspot = {
  position: 'absolute',
  display: 'block',
  background: 'transparent',
  color: 'transparent',
  overflow: 'hidden',
  textIndent: '-9999px',
  WebkitTapHighlightColor: 'transparent'
};

export default function GreyNomadsHomeScreen({ routes }) {
  return (
    <main
      style={{
        minHeight: '100dvh',
        margin: 0,
        background: '#020a12',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}
    >
      <section
        aria-label="GENEVIEVE Grey Nomads Home"
        style={{
          position: 'relative',
          width: 'min(100%, 941px)',
          margin: '0 auto',
          lineHeight: 0,
          background: '#020a12'
        }}
      >
        <img
          src={homeFace}
          alt="GENEVIEVE Grey Nomads luxury Australian travel home screen"
          draggable="false"
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            margin: 0,
            padding: 0,
            border: 0,
            maxWidth: 'none',
            userSelect: 'none'
          }}
        />

        <nav
          aria-label="Grey Nomads home shortcuts"
          style={{ position: 'absolute', inset: 0, zIndex: 2, lineHeight: 'normal' }}
        >
          <Link
            href={routes.safety}
            aria-label="Route safety"
            style={{ ...hotspot, left: '5.4%', top: '40.2%', width: '43.8%', height: '17.1%' }}
          >
            Route safety
          </Link>

          <Link
            href={routes.budget}
            aria-label="Fuel watch and budget"
            style={{ ...hotspot, left: '50.8%', top: '40.2%', width: '43.8%', height: '17.1%' }}
          >
            Fuel watch and budget
          </Link>

          <Link
            href={routes.trip}
            aria-label="Camp mode and current trip"
            style={{ ...hotspot, left: '5.4%', top: '58.4%', width: '43.8%', height: '16.9%' }}
          >
            Camp mode and current trip
          </Link>

          <Link
            href={routes.around}
            aria-label="Weather alerts"
            style={{ ...hotspot, left: '50.8%', top: '58.4%', width: '43.8%', height: '16.9%' }}
          >
            Weather alerts
          </Link>

          <Link
            href={routes.around}
            aria-label="Nearby stops"
            style={{ ...hotspot, left: '5.4%', top: '76.5%', width: '43.8%', height: '15.6%' }}
          >
            Nearby stops
          </Link>

          <Link
            href={routes.safety}
            aria-label="SOS check-in and emergency safety"
            style={{ ...hotspot, left: '50.8%', top: '76.5%', width: '43.8%', height: '15.6%' }}
          >
            SOS check-in and emergency safety
          </Link>
        </nav>
      </section>
    </main>
  );
}
