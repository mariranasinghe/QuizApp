"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Plus, Trash2, Calendar, Flag, CheckCircle2, Circle, Filter } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Task {
  id: string
  title: string
  description: string
  category: string
  priority: "low" | "medium" | "high"
  dueDate: string
  completed: boolean
  createdAt: string
}

interface TodoListAppProps {
  onClose: () => void
}

const categories = [
  "Study",
  "Assignment", 
  "Project",
  "Exam",
  "Personal",
  "Work",
  "Other"
]

const priorities = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  { value: "high", label: "High", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" }
]

export function TodoListApp({ onClose }: TodoListAppProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
  })

  // Load tasks from localStorage on mount
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem("todoListTasks")
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks))
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage:", error)
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("todoListTasks", JSON.stringify(tasks))
    } catch (error) {
      console.error("Failed to save tasks to localStorage:", error)
    }
  }, [tasks])

  const addTask = () => {
    if (!newTask.title.trim()) {
      return
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      category: newTask.category || "Other",
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    setTasks([task, ...tasks])
    setNewTask({
      title: "",
      description: "",
      category: "",
      priority: "medium",
      dueDate: "",
    })
    setShowAddForm(false)
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString()
  }

  const getPriorityColor = (priority: string) => {
    return priorities.find(p => p.value === priority)?.color || ""
  }

  const filteredTasks = tasks.filter(task => {
    const statusMatch = filter === "all" || 
                       (filter === "pending" && !task.completed) ||
                       (filter === "completed" && task.completed)
    
    const categoryMatch = categoryFilter === "all" || task.category === categoryFilter
    
    return statusMatch && categoryMatch
  })

  const completedCount = tasks.filter(task => task.completed).length
  const pendingCount = tasks.filter(task => !task.completed).length
  const overdueCount = tasks.filter(task => !task.completed && isOverdue(task.dueDate)).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-2xl">
        <CardHeader className="relative pb-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Close To-Do List</span>
          </Button>
          <CardTitle className="text-center text-3xl font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="h-8 w-8" />
            To-Do List
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-blue-200 dark:border-blue-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">{tasks.length}</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Total Tasks</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 border-yellow-200 dark:border-yellow-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">{pendingCount}</div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400">Pending</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-green-200 dark:border-green-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-800 dark:text-green-200">{completedCount}</div>
                <div className="text-sm text-green-600 dark:text-green-400">Completed</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 border-red-200 dark:border-red-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-800 dark:text-red-200">{overdueCount}</div>
                <div className="text-sm text-red-600 dark:text-red-400">Overdue</div>
              </CardContent>
            </Card>
          </div>

          {/* Add Task Button */}
          <div className="mb-6">
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Task
            </Button>
          </div>

          {/* Add Task Form */}
          {showAddForm && (
            <Card className="mb-6 border-2 border-cyan-200 dark:border-cyan-800">
              <CardContent className="p-4">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="taskTitle">Task Title *</Label>
                    <Input
                      id="taskTitle"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="Enter task title..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="taskDescription">Description</Label>
                    <Textarea
                      id="taskDescription"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Enter task description..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="taskCategory">Category</Label>
                      <Select value={newTask.category} onValueChange={(value) => setNewTask({ ...newTask, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="taskPriority">Priority</Label>
                      <Select value={newTask.priority} onValueChange={(value: "low" | "medium" | "high") => setNewTask({ ...newTask, priority: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="taskDueDate">Due Date</Label>
                      <Input
                        id="taskDueDate"
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={addTask} className="flex-1">
                      Add Task
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Status:</span>
              <Select value={filter} onValueChange={(value: "all" | "pending" | "completed") => setFilter(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Category:</span>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tasks List */}
          {filteredTasks.length === 0 ? (
            <Alert>
              <AlertDescription>
                {tasks.length === 0 
                  ? "No tasks yet. Click 'Add New Task' to get started!"
                  : "No tasks match the current filters."
                }
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <Card key={task.id} className={`border transition-all duration-200 ${
                  task.completed 
                    ? "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700" 
                    : isOverdue(task.dueDate)
                    ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950"
                    : "border-gray-200 dark:border-gray-700"
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className={`font-semibold text-lg ${
                              task.completed ? "line-through text-gray-500 dark:text-gray-400" : ""
                            }`}>
                              {task.title}
                            </h4>
                            
                            {task.description && (
                              <p className={`text-sm mt-1 ${
                                task.completed ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-600 dark:text-gray-300"
                              }`}>
                                {task.description}
                              </p>
                            )}
                            
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {task.category}
                              </Badge>
                              
                              <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                                <Flag className="h-3 w-3 mr-1" />
                                {task.priority}
                              </Badge>
                              
                              {task.dueDate && (
                                <Badge variant="outline" className={`text-xs ${
                                  isOverdue(task.dueDate) && !task.completed
                                    ? "border-red-500 text-red-700 dark:text-red-400"
                                    : ""
                                }`}>
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(task.dueDate)}
                                  {isOverdue(task.dueDate) && !task.completed && " (Overdue)"}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTask(task.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
