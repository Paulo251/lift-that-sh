import { SET_TYPE_CLASSES, SET_TYPE_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { SetType } from '@/services/types'

export function SetTypeBadge({ setType, className }: { setType: SetType; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold',
        SET_TYPE_CLASSES[setType],
        className,
      )}
    >
      {SET_TYPE_LABELS[setType]}
    </span>
  )
}
