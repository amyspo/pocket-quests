import { useState } from 'react'

const EMOJI_OPTIONS = ['📖', '🎨', '🌿', '🧘', '🎸', '🚶', '🧁', '🧩', '✨', '☕']

function QuestFormModal({ quest, onClose, onSave }) {
  const [name, setName] = useState(quest?.name ?? '')
  const [emoji, setEmoji] = useState(quest?.emoji ?? EMOJI_OPTIONS[0])

  function handleSubmit(event) {
    event.preventDefault()
    const trimmedName = name.trim()

    if (!trimmedName) {
      return
    }

    onSave({ name: trimmedName, emoji })
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quest-form-heading"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
        <p className="eyebrow">{quest ? 'A LITTLE ADJUSTMENT' : 'MAKE IT YOURS'}</p>
        <h2 id="quest-form-heading">{quest ? 'Edit your quest' : 'Add a new quest'}</h2>
        <p className="modal-description">
          {quest ? 'Change the name or pick a new little symbol.' : 'What would you like to make time for?'}
        </p>
        <form className="quest-form" onSubmit={handleSubmit}>
          <label htmlFor="quest-name">Quest name</label>
          <input
            id="quest-name"
            autoFocus
            maxLength="60"
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Read a few pages"
            required
            type="text"
            value={name}
          />
          <fieldset>
            <legend>Choose an emoji</legend>
            <div className="emoji-options">
              {EMOJI_OPTIONS.map((option) => (
                <button
                  aria-label={`Choose ${option}`}
                  aria-pressed={emoji === option}
                  className={`emoji-option${emoji === option ? ' emoji-option--selected' : ''}`}
                  key={option}
                  onClick={() => setEmoji(option)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="modal-actions">
            <button className="button button--quiet" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="button button--primary" type="submit">
              {quest ? 'Save changes' : 'Add quest'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default QuestFormModal
