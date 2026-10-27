import { useEffect, useState } from 'react'
import QuestFormModal from './components/QuestFormModal.jsx'
import QuestManagementModal from './components/QuestManagementModal.jsx'
import ProgressPanel from './components/ProgressPanel.jsx'
import QuestList from './components/QuestList.jsx'
import QuestSectionHeader from './components/QuestSectionHeader.jsx'
import WelcomeSection from './components/WelcomeSection.jsx'
import {
  getLocalDateKey,
  loadInitialState,
  STORAGE_KEY,
  sortQuestsByProgress,
} from './utils/questState.js'
import './App.css'
import star from './assets/icons/Star.png'

function App() {
  // Passing the function lets React call it only for the initial state.
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
          <img src={star} className="wordmark-star" alt="" />
          pocket quests
        </a>
        <span className="top-bar-note">A little progress goes a long way</span>
      </header>

      <WelcomeSection />

      <ProgressPanel quests={questState.quests} today={today} />

      <section className="quest-section" aria-labelledby="quests-heading">
        <QuestSectionHeader
          onManage={() => setActiveModal('manage')}
          onCreate={openCreateModal}
        />

        <QuestList
          quests={questState.quests}
          today={today}
          onCreate={openCreateModal}
          onToggle={toggleQuestCompletion}
        />
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
