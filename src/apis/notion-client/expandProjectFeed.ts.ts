import { ExtendedRecordMap } from "notion-types"
import { mergeRecordMaps } from "notion-utils"
import { getRecordMap } from "./getRecordMap"

// 응답이 { value } 형태일 수도, { value: { value } } 형태일 수도 있어서 둘 다 처리
const unwrap = (b: any) => b?.value?.value ?? b?.value
const wrap = (sample: any, value: any) =>
  sample?.value?.value
    ? { role: "reader", value: { role: "reader", value } }
    : { role: "reader", value }

// view에 걸린 행(프로젝트 페이지) id 목록 꺼내기
const getRowIds = (recordMap: ExtendedRecordMap, viewIds: string[]) => {
  const queries: any = recordMap.collection_query ?? {}
  for (const viewId of viewIds) {
    for (const views of Object.values<any>(queries)) {
      const result = views?.[viewId]
      const ids = result?.collection_group_results?.blockIds ?? result?.blockIds
      if (ids?.length) return ids as string[]
    }
  }
  return [] as string[]
}

export const expandProjectFeed = async (
  recordMap: ExtendedRecordMap
): Promise<ExtendedRecordMap> => {
  let current = recordMap

  const viewBlockIds = Object.keys(recordMap.block).filter(
    (id) => unwrap(recordMap.block[id])?.type === "collection_view"
  )

  for (const viewBlockId of viewBlockIds) {
    const viewBlock = unwrap(current.block[viewBlockId])
    const rowIds = getRowIds(current, viewBlock.view_ids ?? [])
    if (rowIds.length === 0) continue

    // 프로젝트 페이지들을 각각 불러와서 합치기
    const rowMaps = await Promise.all(rowIds.map((id) => getRecordMap(id)))
    current = rowMaps.reduce(
      (acc, rowMap) => mergeRecordMaps(acc, rowMap),
      current
    )

    const blockMap = current.block as any
    const sample = blockMap[viewBlockId]
    const base = {
      parent_id: viewBlock.parent_id,
      parent_table: "block",
      alive: true,
    }

    // [제목, 본문 블록들, 구분선]을 프로젝트마다 이어 붙이기
    const feed: string[] = []
    for (const rowId of rowIds) {
      const row = unwrap(blockMap[rowId])
      if (!row) continue
      const headerId = `feed-title-${rowId}`
      const dividerId = `feed-divider-${rowId}`
      blockMap[headerId] = wrap(sample, {
        ...base,
        id: headerId,
        type: "sub_header",
        properties: { title: row.properties?.title ?? [[""]] },
      })
      blockMap[dividerId] = wrap(sample, {
        ...base,
        id: dividerId,
        type: "divider",
      })
      feed.push(headerId, ...(row.content ?? []), dividerId)
    }

    // 원래 database 블록 자리를 위 블록들로 교체
    const parent = unwrap(blockMap[viewBlock.parent_id])
    const index = parent?.content?.indexOf(viewBlockId) ?? -1
    if (index >= 0) parent.content.splice(index, 1, ...feed)
  }

  return current
}