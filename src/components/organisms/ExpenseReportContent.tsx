import withFloatingButton from '@/components/hoc/withFloatingButton'
import { FabButton } from '@/components/atoms/FabButton'
import { FinanceReportList } from '@/components/organisms/FinanceReportList'
import { FinanceReport } from '@/features/report/types/finance.type'
import { ColorTheme } from '@/shared/constants/theme'
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'

import React, { useMemo } from 'react'

interface ExpenseReportContentProps {
  finance: FinanceReport[]
  colors: ColorTheme
  isLoading: boolean
  isRefetching: boolean
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<FinanceReport[], Error>>
  filter: {
    fromDate: string
    toDate: string
  }
  setFilter: React.Dispatch<
    React.SetStateAction<{
      fromDate: string
      toDate: string
    }>
  >
  onPress: () => void
  EmptyComponent: React.ComponentType<any> | React.ReactElement | null
  fabPosition: { x: number; y: number }
}

function ContentComponent(props: ExpenseReportContentProps) {
  return (
    <FinanceReportList
      finance={props.finance}
      colors={props.colors}
      isLoading={props.isLoading}
      isRefetching={props.isRefetching}
      refetch={props.refetch}
      filter={props.filter}
      setFilter={props.setFilter}
      EmptyComponent={props.EmptyComponent}
    />
  )
}

export function ExpenseReportContent(props: ExpenseReportContentProps) {
  const ContentWithFab = useMemo(
    () => withFloatingButton(ContentComponent, FabButton, { defaultPosition: props.fabPosition }),
    [props.fabPosition]
  )

  return <ContentWithFab {...props} />
}
