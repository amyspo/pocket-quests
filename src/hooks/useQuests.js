import { useEffect, useState } from 'react'
import {
  getLocalDateKey,
  loadInitialState,
  MAX_DAILY_GOAL,
  MIN_DAILY_GOAL,
  sortQuestsByProgress,
  STORAGE_KEY,
} from '../utils/questState.js'
import {
  getCompletionBadgeUnlocks,
  getDailyGoalBadgeUnlocks,
} from '../utils/badges.js'

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

        const previousDay = currentState.dayKey
        const completedQuests = currentState.quests.filter((quest) =>
          quest.completionDates.includes(previousDay),
        ).length
        const displayedGoal = Math.min(
          currentState.quests.length,
          currentState.dailyGoal,
        )
        const goalMet =
          displayedGoal > 0 && completedQuests >= displayedGoal
        const goalMetDates =
          goalMet && !currentState.goalMetDates.includes(previousDay)
            ? [...currentState.goalMetDates, previousDay]
            : currentState.goalMetDates
        const unlockedBadges = [
          ...currentState.unlockedBadges,
          ...getDailyGoalBadgeUnlocks(
            goalMetDates,
            currentState.unlockedBadges,
          ),
        ]

        return {
          ...currentState,
          dayKey: currentDay,
          quests: sortQuestsByProgress(currentState.quests),
          goalMetDates,
          unlockedBadges,
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
    setQuestState((currentState) => {
      let completedQuest = false
      const quests = currentState.quests.map((quest) => {
        if (quest.id !== questId) {
          return quest
        }

        const isCompletedToday = quest.completionDates.includes(today)
        const completionDates = isCompletedToday
          ? quest.completionDates.filter((date) => date !== today)
          : [...quest.completionDates, today]

        completedQuest = !isCompletedToday
        return { ...quest, completionDates }
      })
      const unlockedBadges = completedQuest
        ? [
            ...currentState.unlockedBadges,
            ...getCompletionBadgeUnlocks(quests, currentState.unlockedBadges),
          ]
        : currentState.unlockedBadges

      return { ...currentState, quests, unlockedBadges }
    })
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

  function setDailyGoal(dailyGoal) {
    if (
      !Number.isInteger(dailyGoal) ||
      dailyGoal < MIN_DAILY_GOAL ||
      dailyGoal > MAX_DAILY_GOAL
    ) {
      throw new RangeError(
        `Daily goal must be a whole number between ${MIN_DAILY_GOAL} and ${MAX_DAILY_GOAL}.`,
      )
    }

    setQuestState((currentState) => ({ ...currentState, dailyGoal }))
  }

  return {
    quests: questState.quests,
    dailyGoal: questState.dailyGoal,
    unlockedBadges: questState.unlockedBadges,
    goalMetDates: questState.goalMetDates,
    today,
    addQuest,
    editQuest,
    deleteQuest,
    setDailyGoal,
    toggleQuestCompletion,
  }
}

export default useQuests
