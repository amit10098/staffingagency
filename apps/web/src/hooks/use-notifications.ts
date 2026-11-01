"use client"

import * as React from "react"
import { api } from "@/lib/api"

export interface Notification {
  id: string
  title: string
  description: string
  type: "info" | "success" | "warning"
  timestamp: string
  isRead: boolean
}

function formatTimestamp(dateStr: string) {
  const date = new Date(dateStr)
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
  return date.toLocaleDateString("en-GB")
}

export const useNotifications = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [loading, setLoading] = React.useState(true)

  const fetchNotifications = React.useCallback(async () => {
    try {
      const data = await api.getNotifications()
      setNotifications(
        data.map((n: any) => ({
          id: n.id,
          title: n.title,
          description: n.message,
          type: (n.type as "info" | "success" | "warning") || "info",
          timestamp: formatTimestamp(n.createdAt),
          isRead: n.isRead,
        })),
      )
    } catch {
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 15000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const addNotification = (_title: string, _description: string, _type: "info" | "success" | "warning" = "info") => {
    fetchNotifications()
  }

  const markAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id)
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
    } catch {
      // ignore
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch {
      // ignore
    }
  }

  return { notifications, addNotification, markAsRead, markAllAsRead, loading, refresh: fetchNotifications }
}
