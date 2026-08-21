import BrandHeader from './BrandHeader';
import BottomNav from './BottomNav';
import LegalFooter from './LegalFooter';

export default function Shell({ children, current = 'Home', compactHeader = true }) {
  return (
    <main className="app-shell premium-app-shell premium-shell-app">
      <div className="australiana-glow" aria-hidden="true" />
      <section className="screen-frame premium-screen-frame">
        <div className="shell-constellation" aria-hidden="true">
          <span className="star star-one" />
          <span className="star star-two" />
          <span className="star star-three" />
          <span className="star star-four" />
          <span className="star star-five" />
        </div>
        <div className="shell-landline" aria-hidden="true" />
        <BrandHeader compact={compactHeader} />
        <div className="premium-page-content">{children}</div>
        <LegalFooter />
        <BottomNav current={current} />
      </section>
    </main>
  );
}
