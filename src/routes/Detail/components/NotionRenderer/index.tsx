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
  import("react-notion-x/build/third-party/code").then(async (m) => {
    // prism 기본 언어(js, ts, css, html, json 등) 외에 블로그에서 쓰는 언어를 등록한다
    await Promise.allSettled([
      import("prismjs/components/prism-bash.js"),
      import("prismjs/components/prism-java.js"),
      import("prismjs/components/prism-kotlin.js"),
      import("prismjs/components/prism-python.js"),
      import("prismjs/components/prism-sql.js"),
      import("prismjs/components/prism-yaml.js"),
      import("prismjs/components/prism-hcl.js"),
      import("prismjs/components/prism-docker.js"),
      import("prismjs/components/prism-go.js"),
      import("prismjs/components/prism-c.js"),
      import("prismjs/components/prism-diff.js"),
      import("prismjs/components/prism-ini.js"),
      import("prismjs/components/prism-properties.js"),
      import("prismjs/components/prism-toml.js"),
      import("prismjs/components/prism-groovy.js"),
    ])
    // cpp는 c 위에 정의되므로 c 다음에 불러온다
    await import("prismjs/components/prism-cpp.js")
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
