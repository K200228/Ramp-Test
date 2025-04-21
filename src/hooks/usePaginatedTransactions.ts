import { useCallback, useState } from "react"
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types"
import { PaginatedTransactionsResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function usePaginatedTransactions(): PaginatedTransactionsResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<
    Transaction[]
  > | null>(null)

  const fetchAll = useCallback(async () => {
    const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
      "paginatedTransactions",
      {
        page: paginatedTransactions === null ? 0 : paginatedTransactions.nextPage,
      }
    )

    setPaginatedTransactions((previousResponse) => {
      if (response === null) return previousResponse

      if (previousResponse === null) {
        return response
      }

      return {
        data: [...previousResponse.data, ...response.data],
        nextPage: response.nextPage,
      }
    })

  }, [fetchWithCache, paginatedTransactions])

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null)
  }, [])

  const updateTransaction = useCallback((transactionId: string, updatedFields: Partial<Transaction>) => {
    setPaginatedTransactions((prev) => {
      if (prev === null) return null

      return {
        ...prev,
        data: prev.data.map((tx) =>
          tx.id === transactionId ? { ...tx, ...updatedFields } : tx
        ),
      }
    })
  }, [])

  return { data: paginatedTransactions, loading, fetchAll, invalidateData, updateTransaction }
}
