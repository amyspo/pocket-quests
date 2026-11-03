import { useEffect, useState } from 'react'
import {
  getLocalDateKey,
  loadInitialState,
  sortQuestsByProgress,
  STORAGE_KEY,
} from '../utils/questState.js'

function useQuests() {
  const [questState, setQuestState] = useState(loadInitialState)
  const today = getLocalDateKey()

  useEffect(() => {
    try {
      const savedState = JSON.stringify(questState)

      if (localStorage.getItem(STORAGE_KEY) !== savedState) {
        localStorage.setItem(STORAGE_KEY, savedState)
      }
    } catch (error) {
      console.error('Could not save quests to this browser.', error)
    }
  }, [questState])

  useEffect(() => {
    function refreshOrderForNewDay() {
      const currentDay = getLocalDateKey()

      setQuestState((currentState) => {
        if (currentState.dayKey === currentDay) {
          return currentState
        }

        return {
          dayKey: currentDay,
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

  function addQuest(questDetails) {
    setQuestState((currentState) => ({
      ...currentState,
      quests: [
        ...currentState.quests,
        {
          id: crypto.randomUUID(),
          ...questDetails,
          completionDates: [],
        },
      ],
    }))
  }

  function editQuest(questId, questDetails) {
    setQuestState((currentState) => ({
      ...currentState,
      quests: currentState.quests.map((quest) =>
        quest.id === questId ? { ...quest, ...questDetails } : quest,
      ),
    }))
  }

  function deleteQuest(questId) {
    setQuestState((currentState) => ({
      ...currentState,
      quests: currentState.quests.filter((quest) => quest.id !== questId),
    }))
  }

  return {
    quests: questState.quests,
    today,
    addQuest,
    editQuest,
    deleteQuest,
    toggleQuestCompletion,
  }
}

export default useQuests
