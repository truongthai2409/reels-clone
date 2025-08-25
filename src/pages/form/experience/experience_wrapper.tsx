import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { ProfileFormValues } from '@/types/form.types';
import React, { useCallback } from 'react';
import { SortableItem } from './experience_draggable_list';
import { ExperienceItem } from './experience_item';

// Tách DnD wrapper ra khỏi Formik để tránh re-render
interface ExperienceWrapper {
  experiences: any[];
  move: (oldIndex: number, newIndex: number) => void;
  setFieldValue: (field: string, value: unknown) => void;
  values: ProfileFormValues;
}

export const ExperienceWrapper = React.memo<ExperienceWrapper>(
  function ExperiencesDndWrapper({ experiences, move, setFieldValue, values }) {
    // Move hooks to top level - không thể gọi hooks trong useMemo
    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: { distance: 8 },
      })
    );

    // Callback cho drag end để tránh re-render
    const handleDragEnd = useCallback(
      (
        event: DragEndEvent,
        moveFn: (oldIndex: number, newIndex: number) => void,
        expList: any[]
      ) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
          const oldIndex = expList.findIndex(
            (exp: any) => exp.id === active.id
          );
          const newIndex = expList.findIndex((exp: any) => exp.id === over.id);

          if (oldIndex !== -1 && newIndex !== -1) {
            moveFn(oldIndex, newIndex);
          }
        }
      },
      []
    );

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={event => handleDragEnd(event, move, experiences)}
      >
        <SortableContext
          items={experiences.map(exp => exp.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-6">
            {experiences.map((exp, idx) => (
              <SortableItem key={exp.id} id={exp.id}>
                <ExperienceItem
                  idx={idx}
                  total={experiences.length}
                  setFieldValue={setFieldValue}
                  values={values}
                />
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    );
  }
);
