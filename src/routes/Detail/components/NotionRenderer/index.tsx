import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { ExtendedRecordMap } from "notion-types"
import useScheme from "src/hooks/useScheme"

// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css"

// used for code syntax highlighting (optional)
import "prismjs/themes/prism-tomorrow.css"

// used for rendering equations (optional)

import "katex/dist/katex.min.css"
import { FC } from "react"
import styled from "@emotion/styled"

const _NotionRenderer = dynamic(
  () => import("react-notion-x").then((m) => m.NotionRenderer),
  { ssr: false }
)

const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then(async (m) => m.Code)
)

const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
)
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
)
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
  }
)
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
)

const mapPageUrl = (id: string) => {
  return "https://www.notion.so/" + id.replace(/-/g, "")
}

type Props = {
  recordMap: ExtendedRecordMap
}

const NotionRenderer: FC<Props> = ({ recordMap }) => {
  const [scheme] = useScheme()
  return (
    <StyledWrapper>
      <_NotionRenderer
        darkMode={scheme === "dark"}
        recordMap={recordMap}
        components={{
          Code,
          Collection,
          Equation,
          Modal,
          Pdf,
          nextImage: Image,
          nextLink: Link,
        }}
        mapPageUrl={mapPageUrl}
      />
    </StyledWrapper>
  )
}

export default NotionRenderer

const StyledWrapper = styled.div`
  /* // TODO: why render? */
  .notion-collection-page-properties {
    display: none !important;
  }
  .notion-page {
    padding: 0;
  }
  .notion-list {
    width: 100%;
  }

  /* 이모지: Windows 기본 이모지 대신 Noto Color Emoji를 먼저 쓴다 (_document.tsx에서 로드) */
  .notion {
    --notion-font: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Helvetica, Arial, "Apple Color Emoji", "Noto Color Emoji", "Segoe UI Emoji",
      sans-serif;
  }
  .notion .notion-page-icon {
    font-family: "Apple Color Emoji", "Noto Color Emoji", "Segoe UI Emoji",
      sans-serif;
  }

  /* 표: 노션처럼 연한 테두리와 헤더 배경 */
  .notion .notion-simple-table,
  .notion .notion-simple-table td {
    border-color: rgba(55, 53, 47, 0.16);
  }
  .notion .notion-simple-table td {
    padding: 7px 9px;
  }
  .notion .notion-simple-table-header-row td,
  .notion .notion-simple-table-header-cell {
    background: rgb(247, 246, 243);
  }
  .notion.dark-mode .notion-simple-table,
  .notion.dark-mode .notion-simple-table td {
    border-color: rgba(255, 255, 255, 0.13);
  }
  .notion.dark-mode .notion-simple-table-header-row td,
  .notion.dark-mode .notion-simple-table-header-cell {
    background: rgba(255, 255, 255, 0.04);
  }
`
