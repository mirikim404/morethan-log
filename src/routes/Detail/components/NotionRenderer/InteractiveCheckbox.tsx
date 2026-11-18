import { KeyboardEvent, useEffect, useState } from "react"

// 노션 체크박스를 클릭할 수 있게 하고, 체크 상태는 방문자 브라우저의 localStorage에만 저장한다
const STORAGE_KEY = "notion-todo-checked"

const readSaved = (): Record<string, boolean> => {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}")
  } catch {
    return {}
  }
}

type Props = {
  isChecked: boolean
  blockId?: string
}

const InteractiveCheckbox = ({ isChecked, blockId }: Props) => {
  const [checked, setChecked] = useState(isChecked)

  useEffect(() => {
    if (!blockId) return
    const saved = readSaved()[blockId]
    if (typeof saved === "boolean") setChecked(saved)
  }, [blockId])

  const toggle = () => {
    const next = !checked
    setChecked(next)
    if (!blockId) return
    try {
      const saved = readSaved()
      saved[blockId] = next
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    } catch {
      // 저장이 막힌 환경(시크릿 모드 등)에서는 화면에서만 체크된다
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      toggle()
    }
  }

  return (
    <span
      className="notion-property notion-property-checkbox notion-interactive-checkbox"
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={toggle}
      onKeyDown={onKeyDown}
    >
      {checked ? (
        <div className="notion-property-checkbox-checked">
          <svg viewBox="0 0 14 14">
            <path d="M5.5 12L14 3.5 12.5 2l-7 7-4-4.003L0 6.499z" />
          </svg>
        </div>
      ) : (
        <div className="notion-property-checkbox-unchecked" />
      )}
    </span>
  )
}

export default InteractiveCheckbox
