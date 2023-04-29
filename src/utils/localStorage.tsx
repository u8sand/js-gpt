import React from 'react'

export default function useLocalStorage(localStorageKey: string, initialState: string) {
  const [state, setState] = React.useState(initialState)
  React.useEffect(() => {
    const localStorageListener = (ev: StorageEvent) => {
      if (ev.key !== localStorageKey) return
      setState(() => ev.newValue || '')
    }
    setState(() => localStorage.getItem(localStorageKey) || initialState)
    window.addEventListener('storage', localStorageListener)
    return () => {
      window.removeEventListener('storage', localStorageListener)
    }
  }, [localStorageKey, initialState])
  return [state, (update: (currentValue: string) => string) => {
    return setState((currentState) => {
      const newState = update(currentState)
      if (newState != state) {
        localStorage.setItem(localStorageKey, newState)
        return newState
      } else {
        return currentState
      }
    })
  }] as const
}
