"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, CreditCard, Star, CheckCircle2, MapPin, ChevronRight, ArrowRight, Camera, Loader2 } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

const upcomingShifts = [
  { date: "Mon 09 Jun", time: "09:00–17:00", role: "Waitstaff", location: "The Grand Hotel, Manchester", status: "Confirmed" },
  { date: "Wed 11 Jun", time: "11:00–22:00", role: "Chef de Partie", location: "Luxury Events Co., London", status: "Confirmed" },
  { date: "Fri 13 Jun", time: "07:00–15:00", role: "Kitchen Porter", location: "Business Events, Leeds", status: "Pending" },
]

const statusStyle: Record<string, string> = {
  Confirmed: "bg-green-500/10 text-green-600 border-green-200",
  Pending: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
}

export default function EmployeeDashboard() {
  const [clockedIn, setClockedIn] = React.useState(false)
  const [startTime, setStartTime] = React.useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = React.useState("00:00:00")
  const [showClockModal, setShowClockModal] = React.useState(false)
  const [location, setLocation] = React.useState<{ lat: number, lng: number } | null>(null)
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (clockedIn && startTime) {
      interval = setInterval(() => {
        const now = new Date()
        const diff = now.getTime() - startTime.getTime()
        const hours = Math.floor(diff / 3600000).toString().padStart(2, "0")
        const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, "0")
        const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, "0")
        setElapsedTime(`${hours}:${minutes}:${seconds}`)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [clockedIn, startTime])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
    }
  }

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        setCapturedImage(canvas.toDataURL("image/jpeg"))
        stopCamera()
      }
    }
  }

  const handleClockIn = async () => {
    setLoading(true)
    // Get Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        },
        (err) => console.error(err)
      )
    }

    // Simulate API Call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setStartTime(new Date())
    setClockedIn(true)
    setLoading(false)
    setShowClockModal(false)
    setCapturedImage(null)
  }

  const handleClockOut = () => {
    setClockedIn(false)
    setStartTime(null)
    setElapsedTime("00:00:00")
    setLocation(null)
    setCapturedImage(null)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">My Workspace</h1>
          <p className="text-muted-foreground text-sm mt-1">Welcome back, Jordan · Ready for your shift?</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="font-medium gap-2 border-border/60 hover:bg-muted transition-all">Update Availability</Button>
          {!clockedIn ? (
            <Button
              className="font-semibold gap-2 shadow-lg bg-primary shadow-primary/20 transition-all duration-300"
              onClick={() => { setShowClockModal(true); startCamera(); }}
            >
              <Clock className="h-4 w-4" />
              Clock In Now
            </Button>
          ) : (
            <Button
              className="font-semibold gap-2 shadow-lg bg-red-500 hover:bg-red-600 shadow-red-200 transition-all duration-300"
              onClick={handleClockOut}
            >
              <Clock className="h-4 w-4 animate-pulse" />
              Clock Out
            </Button>
          )}
        </div>
      </div>

      {clockedIn && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-200 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse ring-4 ring-green-500/20" />
          <p className="text-sm font-semibold text-green-700">You are currently on shift · Started at {startTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-green-600 font-mono tracking-widest bg-white/50 px-2 py-0.5 rounded border border-green-200/50">{elapsedTime}</span>
          </div>
        </div>
      )}

      {/* Stat Cards - Removed Total Earnings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: "Upcoming Shifts", value: "4", note: "Next: Tomorrow, 9am", icon: Calendar, color: "blue" },
          { label: "Hours Worked", value: "42h", note: "+5h overtime this month", icon: Clock, color: "purple" },
          { label: "Your Rating", value: "4.9/5", note: "Based on 12 shifts", icon: Star, color: "orange" },
        ].map((stat) => (
          <Card key={stat.label} className="card-hover border-0 shadow-sm">
            <CardContent className="p-5">
              <div className={`h-9 w-9 rounded-lg mb-3 flex items-center justify-center ${
                stat.color === "blue" ? "bg-blue-500/10" :
                stat.color === "green" ? "bg-green-500/10" :
                stat.color === "purple" ? "bg-purple-500/10" : "bg-orange-500/10"
              }`}>
                <stat.icon className={`h-4.5 w-4.5 ${
                  stat.color === "blue" ? "text-blue-500" :
                  stat.color === "green" ? "text-green-500" :
                  stat.color === "purple" ? "text-purple-500" : "text-yellow-500"
                }`} />
              </div>
              <p className="text-2xl font-extrabold">{stat.value}</p>
              <p className="text-xs font-semibold text-muted-foreground mt-0.5">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-1 gap-6">
        {/* Upcoming Shifts - Extended layout since Chart is removed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-bold">Upcoming Shifts</CardTitle>
            <Link 
              href="/dashboard/employee/rota" 
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-primary text-xs font-medium gap-1"
              )}
            >
              Full Rota <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingShifts.map((shift, i) => (
              <div key={i} className="flex flex-col gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="text-center bg-primary/10 rounded-lg px-3 py-2 flex-shrink-0">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{shift.date.split(" ")[0]}</p>
                    <p className="text-lg font-black text-primary">{shift.date.split(" ")[1]}</p>
                    <p className="text-[10px] text-muted-foreground">{shift.date.split(" ").slice(2).join(" ")}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{shift.role}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Clock className="h-3 w-3" /> {shift.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {shift.location}
                </div>
                <Badge variant="outline" className={`text-[10px] w-fit ${statusStyle[shift.status]}`}>{shift.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick links */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">My Services</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-3">
          {[
            { label: "My Documents", href: "/dashboard/documents", icon: CheckCircle2, desc: "Compliance & RTW" },
            { label: "My Job Board", href: "/dashboard/jobs", icon: Calendar, desc: "Assigned roles" },
            { label: "Payroll", href: "/dashboard/payroll", icon: CreditCard, desc: "View payslips" },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group border border-transparent hover:border-primary/20">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20">
                <item.icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Clock In Modal */}
      <Dialog open={showClockModal} onOpenChange={(open) => { if (!open) stopCamera(); setShowClockModal(open); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Clock In Verification</DialogTitle>
            <DialogDescription>
              Please take a photo to verify your identity and location.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-4 py-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black border-2 border-primary/20">
              {!capturedImage ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="h-full w-full object-cover mirror"
                />
              ) : (
                <img src={capturedImage} alt="Captured" className="h-full w-full object-cover" />
              )}
              {!capturedImage && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-2 border-white/50 border-dashed rounded-full" />
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <MapPin className="h-3 w-3 text-primary" />
              Location recording enabled
            </div>
          </div>
          <DialogFooter className="flex sm:justify-between gap-2">
            {!capturedImage ? (
              <Button onClick={capturePhoto} className="w-full gap-2">
                <Camera className="h-4 w-4" /> Capture Photo
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => { setCapturedImage(null); startCamera(); }} className="flex-1">Retake</Button>
                <Button onClick={handleClockIn} className="flex-1 gap-2" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  Confirm Clock In
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
