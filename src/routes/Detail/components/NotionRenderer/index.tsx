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
import InteractiveCheckbox from "./InteractiveCheckbox"

const _NotionRenderer = dynamic(
  () => import("react-notion-x").then((m) => m.NotionRenderer),
  { ssr: false }
)

const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then(async (m) => {
    // 대부분의 언어는 RootLayout에서 등록한다. 거기 없는 언어만 여기서 추가로 등록한다
    await Promise.allSettled([
      import("prismjs/components/prism-hcl.js"),
      import("prismjs/components/prism-toml.js"),
      import("prismjs/components/prism-ini.js"),
      import("prismjs/components/prism-properties.js"),
      import("prismjs/components/prism-groovy.js"),
    ])
    return m.Code
  })
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
          Checkbox: InteractiveCheckbox,
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

  /* 불렛 간격: 기본 6px 위아래 여백을 노션처럼 좁게 */
  .notion .notion-list li {
    padding: 3px 0;
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

  /* 인용구: 기본 1.2em은 너무 커서 본문과 같은 크기로 */
  .notion .notion-quote {
    font-size: 1em;
    padding: 0.2em 0.9em;
  }

  /* 코드블록: 개발 블로그 스타일 (One Dark 계열) */
  .notion pre.notion-code,
  .notion pre.notion-code[class*="language-"] {
    background: #282c34;
    color: #abb2bf;
    border-radius: 10px;
    padding: 1.1em 1.25em;
    margin: 8px 0;
    font-size: 13.5px;
    line-height: 1.65;
    text-shadow: none;
  }
  .notion pre.notion-code code,
  .notion pre.notion-code code[class*="language-"] {
    font-family: "JetBrains Mono", D2Coding, Consolas, "Liberation Mono", Menlo,
      monospace;
    color: inherit;
    background: none;
    text-shadow: none;
  }
  .notion pre.notion-code .token.comment,
  .notion pre.notion-code .token.prolog,
  .notion pre.notion-code .token.doctype,
  .notion pre.notion-code .token.cdata {
    color: #7f848e;
    font-style: italic;
  }
  .notion pre.notion-code .token.keyword,
  .notion pre.notion-code .token.atrule,
  .notion pre.notion-code .token.important {
    color: #c678dd;
  }
  .notion pre.notion-code .token.string,
  .notion pre.notion-code .token.char,
  .notion pre.notion-code .token.attr-value,
  .notion pre.notion-code .token.inserted {
    color: #98c379;
  }
  .notion pre.notion-code .token.number,
  .notion pre.notion-code .token.boolean,
  .notion pre.notion-code .token.constant {
    color: #d19a66;
  }
  .notion pre.notion-code .token.function {
    color: #61afef;
  }
  .notion pre.notion-code .token.class-name,
  .notion pre.notion-code .token.builtin {
    color: #e5c07b;
  }
  .notion pre.notion-code .token.property,
  .notion pre.notion-code .token.key,
  .notion pre.notion-code .token.attr-name,
  .notion pre.notion-code .token.tag,
  .notion pre.notion-code .token.deleted,
  .notion pre.notion-code .token.variable {
    color: #e06c75;
  }
  .notion pre.notion-code .token.punctuation,
  .notion pre.notion-code .token.operator {
    color: #abb2bf;
  }
  .notion .notion-code-copy-button {
    color: #abb2bf;
    background: rgba(255, 255, 255, 0.08);
  }
  .notion .notion-code-copy-button:hover,
  .notion .notion-code-copy-button:active {
    background: rgba(255, 255, 255, 0.16);
  }
  /* "Copied" 툴팁: 기본은 버튼 아래(코드블록 밖)에 떠서 스크롤바가 생기므로 버튼 왼쪽에 띄운다 */
  .notion .notion-code-copy-tooltip {
    top: 50%;
    bottom: auto;
    left: auto;
    right: calc(100% + 8px);
    width: auto;
    transform: translateY(-50%);
    white-space: nowrap;
    font-size: 12px;
  }

  /* 체크박스: 클릭 가능 표시, 취소선은 현재 체크 상태를 따라가게 */
  .notion .notion-interactive-checkbox {
    cursor: pointer;
  }
  .notion .notion-to-do-body.notion-to-do-checked {
    text-decoration: none;
    opacity: 1;
  }
  .notion .notion-to-do-item:has(.notion-property-checkbox-checked) .notion-to-do-body {
    text-decoration: line-through;
    opacity: 0.55;
  }

  /* 인라인 코드: 배경과 색을 진하게 해서 눈에 띄게 */
  .notion .notion-inline-code {
    font-family: "JetBrains Mono", D2Coding, Consolas, "Liberation Mono", Menlo,
      monospace;
    font-size: 0.88em;
    padding: 0.15em 0.4em;
    border-radius: 5px;
    color: #c7254e;
    background: rgba(199, 37, 78, 0.08);
  }
  .notion.dark-mode .notion-inline-code {
    color: #ff7b72;
    background: rgba(255, 255, 255, 0.1);
  }

  /* 콜아웃: 노션의 탁한 배경 대신, 인라인 코드·코드블록과 같은 계열의 색으로 */
  .notion .notion-callout {
    border: 1px solid rgba(55, 53, 47, 0.12);
    border-left-width: 3px;
    border-radius: 8px;
    padding: 14px 16px 14px 12px;
  }
  .notion .notion-callout.notion-gray_background_co {
    background: rgba(55, 53, 47, 0.04);
  }
  .notion .notion-callout.notion-red_background_co {
    background: rgba(224, 108, 117, 0.08);
    border-color: rgba(224, 108, 117, 0.25);
    border-left-color: #e06c75;
  }
  .notion .notion-callout.notion-yellow_background_co {
    background: rgba(202, 138, 4, 0.08);
    border-color: rgba(202, 138, 4, 0.28);
    border-left-color: #ca8a04;
  }
  .notion.dark-mode .notion-callout {
    border-color: rgba(255, 255, 255, 0.1);
  }
  .notion.dark-mode .notion-callout.notion-gray_background_co {
    background: rgba(255, 255, 255, 0.04);
  }
  .notion.dark-mode .notion-callout.notion-red_background_co {
    background: rgba(255, 123, 114, 0.07);
    border-color: rgba(255, 123, 114, 0.22);
    border-left-color: #ff7b72;
  }
  .notion.dark-mode .notion-callout.notion-yellow_background_co {
    background: rgba(250, 204, 21, 0.06);
    border-color: rgba(250, 204, 21, 0.2);
    border-left-color: #facc15;
  }
  /* 콜아웃 이모지는 블로그에서 숨기고, 색에 맞는 라벨을 붙인다 (빨강=핵심, 노랑=참고) */
  .notion .notion-callout > .notion-page-icon-inline,
  .notion .notion-callout > .notion-page-icon {
    display: none;
  }
  .notion .notion-callout {
    padding-left: 16px;
  }
  .notion .notion-callout .notion-callout-text {
    margin-left: 0;
  }
  .notion .notion-callout.notion-red_background_co .notion-callout-text::before,
  .notion .notion-callout.notion-yellow_background_co .notion-callout-text::before {
    display: block;
    margin-bottom: 6px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.02em;
  }
  .notion .notion-callout.notion-red_background_co .notion-callout-text::before {
    content: "핵심";
    color: #e06c75;
  }
  .notion .notion-callout.notion-yellow_background_co .notion-callout-text::before {
    content: "참고";
    color: #ca8a04;
  }
  .notion.dark-mode .notion-callout.notion-red_background_co .notion-callout-text::before {
    color: #ff7b72;
  }
  .notion.dark-mode .notion-callout.notion-yellow_background_co .notion-callout-text::before {
    color: #facc15;
  }

  /* 표: 노션처럼 연한 테두리와 헤더 배경 */
  .notion .notion-simple-table,
  .notion .notion-simple-table td {
    border-color: rgba(55, 53, 47, 0.16);
  }
  .notion .notion-simple-table {
    font-size: 13px;
    line-height: 1.5;
  }
  .notion .notion-simple-table td {
    padding: 5px 8px;
  }
  .notion .notion-simple-table-header-row td {
    font-weight: 600;
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
