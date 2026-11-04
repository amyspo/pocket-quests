// @vitest-environment jsdom

import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App.jsx'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

function renderApp() {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)

  act(() => root.render(<App />))

  return {
    container,
    unmount() {
      act(() => root.unmount())
      container.remove()
    },
  }
}

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  document.body.innerHTML = ''
})

describe('badge navigation', () => {
  it('opens the badges screen and returns to the main screen', () => {
    const view = renderApp()

    act(() => {
      view.container.querySelector('[aria-label="Open badges"]').click()
    })
    expect(
      view.container.querySelector('#badges-title')?.textContent,
    ).toBe('Badges')

    act(() => {
      view.container.querySelector('[aria-label="Back to home"]').click()
    })
    expect(view.container.querySelector('#quests-heading')?.textContent).toBe(
      'Quest board',
    )

    view.unmount()
  })
})
