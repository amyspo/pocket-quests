function QuestManagementModal({ quests, onClose, onDelete, onEdit }) {
  function handleDelete(quest) {
    const confirmed = window.confirm(
      `Delete "${quest.name}"? Its completion history will be permanently lost.`,
    )

    if (confirmed) {
      onDelete(quest.id)
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="modal-card management-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="management-heading"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
        <p className="eyebrow">YOUR QUEST JOURNAL</p>
        <h2 id="management-heading">Manage quests</h2>
        <p className="modal-description">Edit a quest or remove one you no longer need.</p>
        {quests.length === 0 ? (
          <p className="management-empty">There are no quests to manage just yet.</p>
        ) : (
          <ul className="management-list">
            {quests.map((quest) => (
              <li className="management-row" key={quest.id}>
                <span className="management-emoji" aria-hidden="true">{quest.emoji}</span>
                <span className="management-name">{quest.name}</span>
                <button
                  className="text-button"
                  type="button"
                  onClick={() => onEdit(quest)}
                  aria-label={`Edit ${quest.name}`}
                >
                  Edit
                </button>
                <button
                  className="text-button text-button--danger"
                  type="button"
                  onClick={() => handleDelete(quest)}
                  aria-label={`Delete ${quest.name}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="modal-actions">
          <button className="button button--quiet" type="button" onClick={onClose}>
            Done
          </button>
        </div>
      </section>
    </div>
  )
}

export default QuestManagementModal
