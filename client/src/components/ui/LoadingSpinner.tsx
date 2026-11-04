export default function LoadingSpinner() {
  return (
    <div className="min-h-[60vh] flex items-end justify-center gap-[5px] pb-24" aria-label="Loading">
      {[150, 190, 164, 206, 176].map((h, i) => (
        <span
          key={i}
          className="block w-[22px] origin-bottom"
          style={{
            height: h,
            background: i % 2 ? 'var(--panel)' : 'var(--ink)',
            boxShadow: i % 2 ? 'inset 0 0 0 1px var(--hairline)' : 'none',
            animation: `spineRise .9s ${i * 0.08}s ease-in-out infinite alternate`,
          }}
        />
      ))}
      <style>{`@keyframes spineRise{from{transform:scaleY(.86)}to{transform:scaleY(1)}}`}</style>
    </div>
  )
}
