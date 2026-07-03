import type { Category, Equipment, MuscleGroup, SetType } from '@/services/types'

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: 'Peito',
  back: 'Costas',
  legs: 'Pernas',
  shoulders: 'Ombros',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  core: 'Core',
  glutes: 'Glúteos',
  calves: 'Panturrilhas',
  forearms: 'Antebraços',
}

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  barbell: 'Barra',
  dumbbell: 'Halteres',
  machine: 'Máquina',
  cable: 'Polia',
  bodyweight: 'Peso corporal',
  kettlebell: 'Kettlebell',
  band: 'Elástico',
}

export const CATEGORY_LABELS: Record<Category, string> = {
  compound: 'Composto',
  isolation: 'Isolado',
}

export const SET_TYPE_LABELS: Record<SetType, string> = {
  warmup: 'Aquecimento',
  normal: 'Normal',
  drop_set: 'Drop Set',
  super_set: 'Super Set',
  failure: 'Falha',
  rest_pause: 'Rest-Pause',
  negative: 'Negativa',
  pyramid: 'Pirâmide',
}

// Badges por tipo de série: aquecimento em azul claro, normal neutro,
// drop/super/falha em variações de amarelo/dourado.
export const SET_TYPE_CLASSES: Record<SetType, string> = {
  warmup: 'border-sky-500/40 bg-sky-500/15 text-sky-300',
  normal: 'border-slate-500/40 bg-slate-500/15 text-slate-300',
  drop_set: 'border-yellow-500/50 bg-yellow-500/15 text-yellow-300',
  super_set: 'border-amber-500/50 bg-amber-500/15 text-amber-300',
  failure: 'border-yellow-400/60 bg-yellow-400/25 text-yellow-200',
  rest_pause: 'border-orange-500/50 bg-orange-500/15 text-orange-300',
  negative: 'border-purple-500/50 bg-purple-500/15 text-purple-300',
  pyramid: 'border-teal-500/50 bg-teal-500/15 text-teal-300',
}
