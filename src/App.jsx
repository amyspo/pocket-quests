import { useEffect, useState } from 'react'
import QuestCard from './components/QuestCard.jsx'
import QuestFormModal from './components/QuestFormModal.jsx'
import QuestManagementModal from './components/QuestManagementModal.jsx'
import { sampleQuests } from './data/sampleQuests.js'
import './App.css'

const STORAGE_KEY = 'pocket-quests'
const MAX_DAILY_GOAL = 5

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function sortQuestsByProgress(quests) {
  return [...quests].sort((firstQuest, secondQuest) => {
    const completionDifference =
      firstQuest.completionDates.length - secondQuest.completionDates.length

    return (
      completionDifference ||
      firstQuest.name.localeCompare(secondQuest.name)
    )
  })
}

function copySampleQuests() {
  return sampleQuests.map((quest) => ({
    ...quest,
    completionDates: [...quest.completionDates],
  }))
}

function isValidQuest(quest) {
  return (
    quest &&
    typeof quest.id === 'string' &&
    typeof quest.name === 'string' &&
    typeof quest.emoji === 'string' &&
    Array.isArray(quest.completionDates) &&
    quest.completionDates.every((date) => typeof date === 'string')
  )
}

function loadInitialState() {
  const today = getLocalDateKey()

  try {
    const savedState = localStorage.getItem(STORAGE_KEY)

    if (!savedState) {
      return { dayKey: today, quests: sortQuestsByProgress(copySampleQuests()) }
    }

    const parsedState = JSON.parse(savedState)

    if (
      !parsedState ||
      typeof parsedState.dayKey !== 'string' ||
      !Array.isArray(parsedState.quests) ||
      !parsedState.quests.every(isValidQuest)
    ) {
      throw new Error('Saved quest data has an unexpected format.')
    }

    const quests =
      parsedState.dayKey === today
        ? parsedState.quests
        : sortQuestsByProgress(parsedState.quests)

    return { dayKey: today, quests }
  } catch (error) {
    console.error('Could not load saved quests. Starting with sample quests.', error)
    return { dayKey: today, quests: sortQuestsByProgress(copySampleQuests()) }
  }
}

function App() {
  const [questState, setQuestState] = useState(loadInitialState)
  const [activeModal, setActiveModal] = useState(null)
  const [editingQuest, setEditingQuest] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(questState))
    } catch (error) {
      console.error('Could not save quests to this browser.', error)
    }
  }, [questState])

  useEffect(() => {
    function refreshOrderForNewDay() {
      const today = getLocalDateKey()

      setQuestState((currentState) => {
        if (currentState.dayKey === today) {
          return currentState
        }

        return {
          dayKey: today,
          quests: sortQuestsByProgress(currentState.quests),
        }
      })
    }

    const now = new Date()
    const nextMidnight = new Date(now)
    nextMidnight.setHours(24, 0, 0, 0)

    window.addEventListener('focus', refreshOrderForNewDay)
    const midnightTimeout = window.setTimeout(
      refreshOrderForNewDay,
      nextMidnight.getTime() - now.getTime(),
    )

    return () => {
      window.removeEventListener('focus', refreshOrderForNewDay)
      window.clearTimeout(midnightTimeout)
    }
  }, [questState.dayKey])

  const today = getLocalDateKey()
  const dailyGoal = Math.min(questState.quests.length, MAX_DAILY_GOAL)
  const completedToday = questState.quests.filter((quest) =>
    quest.completionDates.includes(today),
  ).length
  const displayedProgress = Math.min(completedToday, dailyGoal)
  const goalReached = dailyGoal > 0 && displayedProgress === dailyGoal

  function toggleQuestCompletion(questId) {
    setQuestState((currentState) => ({
      ...currentState,
      quests: currentState.quests.map((quest) => {
        if (quest.id !== questId) {
          return quest
        }

        const isCompletedToday = quest.completionDates.includes(today)
        const completionDates = isCompletedToday
          ? quest.completionDates.filter((date) => date !== today)
          : [...quest.completionDates, today]

        return { ...quest, completionDates }
      }),
    }))
  }

  function saveQuest(questDetails) {
    setQuestState((currentState) => {
      if (editingQuest) {
        return {
          ...currentState,
          quests: currentState.quests.map((quest) =>
            quest.id === editingQuest.id
              ? { ...quest, ...questDetails }
              : quest,
          ),
        }
      }

      return {
        ...currentState,
        quests: [
          ...currentState.quests,
          {
            id: crypto.randomUUID(),
            ...questDetails,
            completionDates: [],
          },
        ],
      }
    })
    setEditingQuest(null)
    setActiveModal(null)
  }

  function deleteQuest(questId) {
    setQuestState((currentState) => ({
      ...currentState,
      quests: currentState.quests.filter((quest) => quest.id !== questId),
    }))
  }

  function openCreateModal() {
    setEditingQuest(null)
    setActiveModal('create')
  }

  function openEditModal(quest) {
    setEditingQuest(quest)
    setActiveModal('create')
  }

  function closeModal() {
    setActiveModal(null)
    setEditingQuest(null)
  }

  return (
    <main className="home-screen">
      <header className="top-bar">
        <a className="wordmark" href="/" aria-label="Pocket Quests home">
          <span className="wordmark-icon" aria-hidden="true">✦</span>
          pocket quests
        </a>
        <span className="top-bar-note">A little progress goes a long way</span>
      </header>

      <section className="welcome" aria-labelledby="welcome-heading">
        <div className="welcome-copy">
          <p className="eyebrow">YOUR PERSONAL QUEST JOURNAL</p>
          <h1 id="welcome-heading">Hello, traveler <span aria-hidden="true">✷</span></h1>
          <p className="welcome-description">
            Make a little room for the things that make you feel like you.
          </p>
        </div>
        <div className="welcome-sparkle" aria-hidden="true">✦</div>
      </section>

      <section className="progress-panel" aria-labelledby="progress-heading">
        <div className="progress-copy">
          <div>
            <p className="eyebrow" id="progress-heading">TODAY&apos;S LITTLE WINS</p>
            <p className="progress-count">
              <strong>{displayedProgress}</strong> of {dailyGoal} quests done today
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

      <section className="quest-section" aria-labelledby="quests-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR ADVENTURES</p>
            <h2 id="quests-heading">Quest board <span aria-hidden="true">🪴</span></h2>
          </div>
          <div className="section-actions">
            <button
              className="button button--quiet"
              type="button"
              onClick={() => setActiveModal('manage')}
            >
              Manage
            </button>
            <button className="button button--primary" type="button" onClick={openCreateModal}>
              <span aria-hidden="true">+</span> New quest
            </button>
          </div>
        </div>

        {questState.quests.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon" aria-hidden="true">🌱</span>
            <h3>Add quests to start your journey.</h3>
            <p>Pick one small thing you would love to make time for.</p>
            <button className="button button--primary" type="button" onClick={openCreateModal}>
              Add your first quest
            </button>
          </div>
        ) : (
          <ul className="quest-list" aria-label="Your quests">
            {questState.quests.map((quest) => (
              <li key={quest.id}>
                <QuestCard
                  quest={quest}
                  isCompleted={quest.completionDates.includes(today)}
                  onToggle={() => toggleQuestCompletion(quest.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="home-footer">
        <span aria-hidden="true">✿</span> Small steps, lovely journeys.
      </footer>

      {activeModal === 'create' && (
        <QuestFormModal
          quest={editingQuest}
          onClose={closeModal}
          onSave={saveQuest}
        />
      )}
      {activeModal === 'manage' && (
        <QuestManagementModal
          quests={questState.quests}
          onClose={closeModal}
          onDelete={deleteQuest}
          onEdit={openEditModal}
        />
      )}
    </main>
  )
}

export default App
