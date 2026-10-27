import QuestCard from './QuestCard.jsx'

function QuestList({ quests, today, onCreate, onToggle }) {
  if (quests.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon" aria-hidden="true">🌱</span>
        <h3>Add quests to start your journey.</h3>
        <p>Pick one small thing you would love to make time for.</p>
        <button className="button button--primary" type="button" onClick={onCreate}>
          Add your first quest
        </button>
      </div>
    )
  }

  return (
    <ul className="quest-list" aria-label="Your quests">
      {quests.map((quest) => (
        <li key={quest.id}>
          <QuestCard
            quest={quest}
            isCompleted={quest.completionDates.includes(today)}
            onToggle={() => onToggle(quest.id)}
          />
        </li>
      ))}
    </ul>
  )
}

export default QuestList
