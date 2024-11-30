export default function useLocalStorage<T>(key: string, defaultValue?: T) {
  const val = ref<T | undefined>(defaultValue)

  const storageVal = window.localStorage.getItem(key)

  if (storageVal) {
    val.value = JSON.parse(storageVal)
  }

  function handleOnStorageEvent(event: StorageEvent) {
    if (event.key === key) {
      val.value = JSON.parse(event.newValue || 'null')
    }
  }

  window.addEventListener('storage', handleOnStorageEvent)

  onScopeDispose(() => {
    window.removeEventListener('storage', handleOnStorageEvent)
  })

  watch(val, (newVal) => window.localStorage.setItem(key, JSON.stringify(newVal)), { deep: true })

  return val
}
