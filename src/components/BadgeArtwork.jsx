const BADGE_ARTWORK = '🏆'

function BadgeArtwork({ locked = false, className = '' }) {
  const classes = [
    'badge-artwork',
    locked && 'badge-artwork--locked',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} aria-hidden="true">
      {BADGE_ARTWORK}
    </span>
  )
}

export default BadgeArtwork
