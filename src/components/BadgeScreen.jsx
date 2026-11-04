import BadgeArtwork from './BadgeArtwork.jsx'
import { BADGES } from '../utils/badges.js'

function BadgeScreen({ unlockedBadges, onBack }) {
  return (
    <main className="home-screen badges-screen">
      <header className="top-bar badges-top-bar">
        <button
          className="badge-back-button"
          type="button"
          aria-label="Back to home"
          onClick={onBack}
        >
          <span aria-hidden="true">←</span> Back
        </button>
        <span className="top-bar-note">Your little achievements</span>
      </header>

      <section className="badges-heading" aria-labelledby="badges-title">
        <p className="eyebrow">YOUR COLLECTION</p>
        <h1 id="badges-title">Badges</h1>
      </section>

      <ul className="badge-grid" aria-label="Achievement badges">
        {BADGES.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id)

          return (
            <li
              className={`badge-card${isUnlocked ? ' badge-card--unlocked' : ''}`}
              key={badge.id}
              aria-label={
                isUnlocked ? badge.name : `Locked badge. ${badge.hint}`
              }
            >
              <BadgeArtwork locked={!isUnlocked} />
              {isUnlocked ? (
                <h2 className="badge-name">{badge.name}</h2>
              ) : (
                <p className="badge-hint">{badge.hint}</p>
              )}
            </li>
          )
        })}
      </ul>

      <footer className="home-footer">
        <span aria-hidden="true">✿</span> Every little step counts.
      </footer>
    </main>
  )
}

export default BadgeScreen
