import { useState } from 'react'

function QuestCard({ quest, isCompleted, onToggle }) {
  const [isAnimating, setIsAnimating] = useState(false)

  function handleToggle() {
    if (!isCompleted) {
      setIsAnimating(true)
    }
    onToggle()
  }

  return (
    <article
      className={[
        'quest-card',
        isCompleted ? 'quest-card--completed' : '',
        isAnimating ? 'quest-card--animating' : '',
      ].filter(Boolean).join(' ')}
      onAnimationEnd={() => setIsAnimating(false)}
    >
      <span className="quest-emoji" aria-hidden="true">{quest.emoji}</span>
      <span className="quest-details">
        <span className="quest-name">{quest.name}</span>
        <span className="quest-progress">
          {quest.completionDates.length === 1
            ? '1 little win so far'
            : `${quest.completionDates.length} little wins so far`}
        </span>
      </span>
      <button
        className="quest-complete-button"
        type="button"
        onClick={handleToggle}
        aria-pressed={isCompleted}
        aria-label={`${isCompleted ? 'Undo today’s completion of' : 'Complete'} ${quest.name}`}
      >
        <span aria-hidden="true">{isCompleted ? '✓' : '+'}</span>
      </button>
    </article>
  )
}

export default QuestCard
