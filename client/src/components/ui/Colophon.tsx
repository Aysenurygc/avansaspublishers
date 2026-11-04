/** AVAN over SAS — the name split where it is spoken, both lines ending together. */
export default function Colophon({ className = '' }: { className?: string }) {
  return (
    <span className={`colo ${className}`} aria-label="Avansas">
      <b aria-hidden="true">Avan</b>
      <b aria-hidden="true">sas</b>
    </span>
  )
}
