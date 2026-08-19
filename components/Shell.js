import BrandHeader from './BrandHeader';
import BottomNav from './BottomNav';

export default function Shell({ children, current = 'Home', compactHeader = true }) {
  return (
    <main className="app-shell">
      <div className="australiana-glow" aria-hidden="true" />
      <section className="screen-frame">
        <BrandHeader compact={compactHeader} />
        {children}
        <BottomNav current={current} />
      </section>
    </main>
  );
}
