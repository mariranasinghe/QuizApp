"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LoginDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isPending, setIsPending] = useState(false)
  const [activeTab, setActiveTab] = useState("login") // 'login' or 'signup'

  const handleLogin = async () => {
    setIsPending(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("Login attempt:", { email, password })
    alert("Login simulated! Check console for credentials.")
    setIsPending(false)
    onClose()
  }

  const handleSignUp = async () => {
    setIsPending(true)
    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      setIsPending(false)
      return
    }
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("Sign Up attempt:", { email, password })
    alert("Sign Up simulated! Check console for credentials.")
    setIsPending(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold text-gray-900 dark:text-gray-50">
            {activeTab === "login" ? "Welcome Back!" : "Join the Quiz!"}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {activeTab === "login" ? "Enter your credentials to log in." : "Create an account to save your progress."}
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-4 space-y-4">
            <div>
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isPending}
              />
            </div>
            <div>
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isPending}
              />
            </div>
            <Button onClick={handleLogin} className="w-full" disabled={isPending}>
              {isPending ? "Logging In..." : "Login"}
            </Button>
          </TabsContent>
          <TabsContent value="signup" className="mt-4 space-y-4">
            <div>
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isPending}
              />
            </div>
            <div>
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isPending}
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isPending}
              />
            </div>
            <Button onClick={handleSignUp} className="w-full" disabled={isPending}>
              {isPending ? "Signing Up..." : "Sign Up"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
