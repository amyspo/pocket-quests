// @vitest-environment jsdom

import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'
import BadgeScreen from './BadgeScreen.jsx'
import { BADGES } from '../utils/badges.js'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

function renderBadgeScreen(unlockedBadges = []) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)

  act(() => {
    root.render(
      createElement(BadgeScreen, {
        unlockedBadges,
        onBack: () => {},
      }),
    )
  })

  return {
    container,
    unmount() {
      act(() => root.unmount())
      container.remove()
    },
  }
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('BadgeScreen', () => {
  it('renders every badge from the badge definitions', () => {
    const view = renderBadgeScreen()

    expect(view.container.querySelectorAll('.badge-card')).toHaveLength(
      BADGES.length,
    )
    for (const badge of BADGES) {
      expect(view.container.textContent).toContain(badge.hint)
    }

    view.unmount()
  })

  it('shows unlocked badges with their names and locked badges with hints', () => {
    const unlockedBadge = BADGES[0]
    const lockedBadge = BADGES[1]
    const view = renderBadgeScreen([unlockedBadge.id])
    const cards = view.container.querySelectorAll('.badge-card')
    const unlockedCard = cards[0]
    const lockedCard = cards[1]

    expect(unlockedCard.textContent).toContain(unlockedBadge.name)
    expect(
      unlockedCard.querySelector('.badge-artwork--locked'),
    ).toBeNull()
    expect(view.container.textContent).toContain(lockedBadge.hint)
    expect(
      view.container.querySelector('.badge-artwork--locked'),
    ).not.toBeNull()
    expect(lockedCard.textContent).not.toContain(unlockedBadge.name)

    view.unmount()
  })
})
