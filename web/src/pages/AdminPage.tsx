import { Pencil, Plus, ShieldCheck, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/context/AuthContext'
import {
  useAdminExercises,
  useAdminUsers,
  useDeleteAdminExercise,
  useDeleteAdminUser,
  useSaveAdminExercise,
  useSaveAdminUser,
} from '@/hooks/useAdmin'
import {
  CATEGORY_LABELS,
  EQUIPMENT_LABELS,
  MUSCLE_GROUP_LABELS,
} from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { AdminExercise, AdminUser } from '@/services/admin'
import type { Category, Equipment, MuscleGroup } from '@/services/types'

export function AdminPage() {
  const { user } = useAuth()

  if (!user?.admin) return <Navigate to="/" replace />

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-6 w-6 text-primary" />
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide">Administração</h1>
      </div>
      <Tabs defaultValue="exercises">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="exercises">Exercícios</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
        </TabsList>
        <TabsContent value="exercises">
          <ExercisesAdmin />
        </TabsContent>
        <TabsContent value="users">
          <UsersAdmin />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function UsersAdmin() {
  const { user: currentUser } = useAuth()
  const { data: users, isLoading } = useAdminUsers()
  const saveUser = useSaveAdminUser()
  const deleteUser = useDeleteAdminUser()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<AdminUser | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  function openDialog(user: AdminUser | null) {
    setEditing(user)
    setName(user?.name ?? '')
    setEmail(user?.email ?? '')
    setPassword('')
    setIsAdmin(user?.admin ?? false)
    setOpen(true)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    saveUser.mutate(
      {
        id: editing?.id ?? null,
        input: { name, email, admin: isAdmin, ...(password ? { password } : {}) },
      },
      { onSuccess: () => setOpen(false) },
    )
  }

  function handleDelete(user: AdminUser) {
    if (!window.confirm(`Excluir o usuário "${user.email}"? Treinos e histórico dele serão apagados.`)) return
    deleteUser.mutate(user.id)
  }

  return (
    <div className="space-y-3">
      <Button size="sm" onClick={() => openDialog(null)}>
        <Plus className="h-4 w-4" /> Novo usuário
      </Button>

      {isLoading && <p className="py-8 text-center text-muted-foreground">Carregando...</p>}

      {users && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-2">Usuário</TableHead>
              <TableHead className="px-2">Perfil</TableHead>
              <TableHead className="px-2 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="p-2">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </TableCell>
                <TableCell className="p-2">
                  {user.admin ? <Badge>Admin</Badge> : <Badge variant="secondary">Comum</Badge>}
                </TableCell>
                <TableCell className="p-2 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openDialog(user)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={user.id === currentUser?.id}
                    onClick={() => handleDelete(user)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display uppercase">
              {editing ? 'Editar usuário' : 'Novo usuário'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-user-name">Nome</Label>
              <Input
                id="admin-user-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-user-email">Email</Label>
              <Input
                id="admin-user-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-user-password">Senha</Label>
              <Input
                id="admin-user-password"
                type="password"
                minLength={6}
                required={!editing}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={editing ? 'Deixe em branco para manter' : 'Mínimo 6 caracteres'}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              Administrador
            </label>
            <Button type="submit" className="w-full" disabled={saveUser.isPending}>
              {saveUser.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const EMPTY_EXERCISE = {
  name: '',
  description: '',
  primary_muscle_group: 'chest' as MuscleGroup,
  equipment: 'barbell' as Equipment,
  category: 'compound' as Category,
  secondary_muscle_groups: [] as string[],
}

function ExercisesAdmin() {
  const { data: exercises, isLoading } = useAdminExercises()
  const saveExercise = useSaveAdminExercise()
  const deleteExercise = useDeleteAdminExercise()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<AdminExercise | null>(null)
  const [form, setForm] = useState(EMPTY_EXERCISE)

  function openDialog(exercise: AdminExercise | null) {
    setEditing(exercise)
    setForm(
      exercise
        ? {
            name: exercise.name,
            description: exercise.description ?? '',
            primary_muscle_group: exercise.primary_muscle_group,
            equipment: exercise.equipment,
            category: exercise.category,
            secondary_muscle_groups: exercise.secondary_muscle_groups,
          }
        : EMPTY_EXERCISE,
    )
    setOpen(true)
  }

  function toggleSecondary(group: string) {
    setForm((f) => ({
      ...f,
      secondary_muscle_groups: f.secondary_muscle_groups.includes(group)
        ? f.secondary_muscle_groups.filter((g) => g !== group)
        : [...f.secondary_muscle_groups, group],
    }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    saveExercise.mutate(
      { id: editing?.id ?? null, input: form },
      { onSuccess: () => setOpen(false) },
    )
  }

  function handleDelete(exercise: AdminExercise) {
    const warning =
      exercise.workouts_count > 0
        ? `"${exercise.name}" está em ${exercise.workouts_count} treino(s). Os treinos serão mantidos, mas o exercício será removido deles. Continuar?`
        : `Excluir "${exercise.name}" do catálogo?`
    if (!window.confirm(warning)) return
    deleteExercise.mutate(exercise.id)
  }

  return (
    <div className="space-y-3">
      <Button size="sm" onClick={() => openDialog(null)}>
        <Plus className="h-4 w-4" /> Novo exercício
      </Button>

      {isLoading && <p className="py-8 text-center text-muted-foreground">Carregando...</p>}

      {exercises && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-2">Exercício</TableHead>
              <TableHead className="px-2">Uso</TableHead>
              <TableHead className="px-2 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exercises.map((exercise) => (
              <TableRow key={exercise.id}>
                <TableCell className="p-2">
                  <p className="font-medium">{exercise.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {MUSCLE_GROUP_LABELS[exercise.primary_muscle_group]} ·{' '}
                    {EQUIPMENT_LABELS[exercise.equipment]}
                  </p>
                </TableCell>
                <TableCell className="p-2 text-sm text-muted-foreground">
                  {exercise.workouts_count > 0
                    ? `${exercise.workouts_count} treino(s)`
                    : '—'}
                </TableCell>
                <TableCell className="p-2 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openDialog(exercise)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDelete(exercise)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display uppercase">
              {editing ? 'Editar exercício' : 'Novo exercício'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-ex-name">Nome</Label>
              <Input
                id="admin-ex-name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-ex-description">Descrição</Label>
              <Input
                id="admin-ex-description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Grupo muscular</Label>
                <Select
                  value={form.primary_muscle_group}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, primary_muscle_group: v as MuscleGroup }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(MUSCLE_GROUP_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Equipamento</Label>
                <Select
                  value={form.equipment}
                  onValueChange={(v) => setForm((f) => ({ ...f, equipment: v as Equipment }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(EQUIPMENT_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v as Category }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Músculos secundários</Label>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(MUSCLE_GROUP_LABELS).map(([value, label]) => {
                  const selected = form.secondary_muscle_groups.includes(value)
                  return (
                    <button
                      type="button"
                      key={value}
                      onClick={() => toggleSecondary(value)}
                      className={cn(
                        'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                        selected
                          ? 'border-primary/60 bg-primary/15 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/40',
                      )}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={saveExercise.isPending}>
              {saveExercise.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
