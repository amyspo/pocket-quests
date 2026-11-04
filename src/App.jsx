import { useEffect, useRef, useState } from 'react'
import QuestFormModal from './components/QuestFormModal.jsx'
import QuestManagementModal from './components/QuestManagementModal.jsx'
import ProgressPanel from './components/ProgressPanel.jsx'
import QuestList from './components/QuestList.jsx'
import QuestSectionHeader from './components/QuestSectionHeader.jsx'
import WelcomeSection from './components/WelcomeSection.jsx'
import BadgeArtwork from './components/BadgeArtwork.jsx'
import BadgeScreen from './components/BadgeScreen.jsx'
import useQuests from './hooks/useQuests.js'
import './App.css'
import logo from './assets/icons/LogoName.png'

function App() {
  const [activeModal, setActiveModal] = useState(null)
  const [activeScreen, setActiveScreen] = useState('home')
  const [editingQuest, setEditingQuest] = useState(null)
  const modalOpenerRef = useRef(null)
  const {
    quests,
    dailyGoal,
    unlockedBadges,
    today,
    addQuest,
    editQuest,
    deleteQuest,
    setDailyGoal,
    toggleQuestCompletion,
  } = useQuests()

  useEffect(() => {
    if (activeModal === null && modalOpenerRef.current?.isConnected) {
      modalOpenerRef.current.focus()
      modalOpenerRef.current = null
    }
  }, [activeModal])

  if (activeScreen === 'badges') {
    return (
      <BadgeScreen
        unlockedBadges={unlockedBadges}
        onBack={() => setActiveScreen('home')}
      />
    )
  }

  function saveQuest(questDetails) {
    if (editingQuest) {
      editQuest(editingQuest.id, questDetails)
    } else {
      addQuest(questDetails)
    }
    setEditingQuest(null)
    setActiveModal(null)
  }

  function openCreateModal() {
    if (activeModal === null) {
      modalOpenerRef.current = document.activeElement
    }
    setEditingQuest(null)
    setActiveModal('create')
  }

  function openManageModal() {
    modalOpenerRef.current = document.activeElement
    setActiveModal('manage')
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
          <img src={logo} alt="Pocket Quests logo" />
        </a>
        <div className="top-bar-actions">
          <span className="top-bar-note">A little progress goes a long way</span>
          <button
            className="trophy-button"
            type="button"
            aria-label="Open badges"
            onClick={() => setActiveScreen('badges')}
          >
            <BadgeArtwork />
            <span>Badges</span>
          </button>
        </div>
      </header>

      <WelcomeSection />

      <ProgressPanel quests={quests} today={today} dailyGoal={dailyGoal} />

      <section className="quest-section" aria-labelledby="quests-heading">
        <QuestSectionHeader
          onManage={openManageModal}
          onCreate={openCreateModal}
        />

        <QuestList
          quests={quests}
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
          quests={quests}
          onClose={closeModal}
          onDelete={deleteQuest}
          onEdit={openEditModal}
          dailyGoal={dailyGoal}
          onDailyGoalChange={setDailyGoal}
        />
      )}
    </main>
  )
}

export default App
