import { useState } from 'react'

function ProgressPanel({ quests, today, dailyGoal }) {
  const displayedGoal = Math.min(quests.length, dailyGoal)
  const completedToday = quests.filter((quest) =>
    quest.completionDates.includes(today),
  ).length
  const displayedProgress = Math.min(completedToday, displayedGoal)
  const goalReached = displayedGoal > 0 && displayedProgress === displayedGoal

  return (
    <section className="progress-panel" aria-labelledby="progress-heading">
      <div className="progress-copy">
        <div>
          <p className="eyebrow" id="progress-heading">TODAY&apos;S JOURNEY</p>
          <p className="progress-count">
            <strong>{displayedProgress}</strong> of {displayedGoal} quests completed
          </p>
        </div>
        <p className={`progress-message${goalReached ? ' progress-message--complete' : ''}`}>
          {goalReached
            ? 'Lovely work — you did it! ✨'
            : displayedProgress === 0
              ? 'Ready when you are.'
              : 'Every little step counts.'}
        </p>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Quests completed today"
        aria-valuemin="0"
        aria-valuemax={displayedGoal}
        aria-valuenow={displayedProgress}
      >
        <span
          className="progress-fill"
            style={{ width: `${displayedGoal ? (displayedProgress / displayedGoal) * 100 : 0}%` }}
        />
      </div>
      {goalReached && <GoalReachedMessage />}
    </section>
  )
}

function GoalReachedMessage() {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) {
    return null
  }

  return (
    <aside className="goal-reached-message" role="status" aria-live="polite">
      <span>Lovely work — you reached your daily goal! ✨</span>
      <button
        className="goal-reached-dismiss"
        type="button"
        onClick={() => setIsDismissed(true)}
      >
        Got it
      </button>
    </aside>
  )
}

export default ProgressPanel
