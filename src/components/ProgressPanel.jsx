const MAX_DAILY_GOAL = 5

function ProgressPanel({ quests, today }) {
  const dailyGoal = Math.min(quests.length, MAX_DAILY_GOAL)
  const completedToday = quests.filter((quest) =>
    quest.completionDates.includes(today),
  ).length
  const displayedProgress = Math.min(completedToday, dailyGoal)
  const goalReached = dailyGoal > 0 && displayedProgress === dailyGoal

  return (
    <section className="progress-panel" aria-labelledby="progress-heading">
      <div className="progress-copy">
        <div>
          <p className="eyebrow" id="progress-heading">TODAY&apos;S JOURNEY</p>
          <p className="progress-count">
            <strong>{displayedProgress}</strong> of {dailyGoal} quests completed
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
        aria-valuemax={dailyGoal}
        aria-valuenow={displayedProgress}
      >
        <span
          className="progress-fill"
          style={{ width: `${dailyGoal ? (displayedProgress / dailyGoal) * 100 : 0}%` }}
        />
      </div>
    </section>
  )
}

export default ProgressPanel
