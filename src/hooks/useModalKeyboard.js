import { useEffect, useRef } from 'react'

function getFocusableElements(dialog) {
  return Array.from(
    dialog.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  )
}

function useModalKeyboard(onClose) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    const focusableElements = getFocusableElements(dialog)

    if (!dialog.contains(document.activeElement)) {
      const initialFocusTarget = focusableElements[0] ?? dialog
      initialFocusTarget.focus()
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const currentFocusableElements = getFocusableElements(dialog)

      if (currentFocusableElements.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }

      const firstElement = currentFocusableElements[0]
      const lastElement = currentFocusableElements[currentFocusableElements.length - 1]

      if (
        event.shiftKey &&
        (document.activeElement === firstElement || !dialog.contains(document.activeElement))
      ) {
        event.preventDefault()
        lastElement.focus()
      } else if (
        !event.shiftKey &&
        (document.activeElement === lastElement || !dialog.contains(document.activeElement))
      ) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    dialog.addEventListener('keydown', handleKeyDown)

    return () => dialog.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return dialogRef
}

export default useModalKeyboard
