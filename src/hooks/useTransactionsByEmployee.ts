import { useCallback, useState } from "react"
import { RequestByEmployeeParams, Transaction } from "../utils/types"
import { TransactionsByEmployeeResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function useTransactionsByEmployee(): TransactionsByEmployeeResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [transactionsByEmployee, setTransactionsByEmployee] = useState<Transaction[] | null>(null)

  const fetchById = useCallback(
    async (employeeId: string) => {
      const data = await fetchWithCache<Transaction[], RequestByEmployeeParams>(
        "transactionsByEmployee",
        {
          employeeId,
        }
      )

      setTransactionsByEmployee(data)
    },
    [fetchWithCache]
  )

  const invalidateData = useCallback(() => {
    setTransactionsByEmployee(null)
  }, [])
  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactionsByEmployee((prev) =>
      prev
        ? prev.map((tx) => (tx.id === id ? { ...tx, ...updates } : tx))
        : prev
    )
  }
  return { data: transactionsByEmployee, loading, fetchById, invalidateData, updateTransaction }
}
