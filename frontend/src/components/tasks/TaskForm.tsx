import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskFormValues } from "./schema";
import { Button } from "../ui/Button";
import { Input, Textarea } from "../ui/Input";
import { DatePicker } from "../ui/DatePicker";
import { cn } from "../../lib/utils";

interface TaskFormProps {
  onSubmit: (data: TaskFormValues) => void;
  defaultValues?: Partial<TaskFormValues>;
  isLoading?: boolean;
}

export function TaskForm({ onSubmit, defaultValues, isLoading }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: "medium",
      status: "TODO",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-24">
      <div className="flex flex-col gap-8">
        <label className="text-sm font-semibold text-slate-700">Title</label>
        <Input
          {...register("title")}
          placeholder="Task title..."
          className={cn(errors.title && "border-red-500")}
        />
        {errors.title && <span className="text-xs text-red-500">{errors.title.message}</span>}
      </div>

      <div className="flex flex-col gap-8">
        <label className="text-sm font-semibold text-slate-700">Description</label>
        <Textarea
          {...register("description")}
          placeholder="Detailed description..."
          className="min-h-[120px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-16">
        <div className="flex flex-col gap-8">
          <label className="text-sm font-semibold text-slate-700">Priority</label>
          <select
            {...register("priority")}
            className="flex h-12 w-full rounded-8 border border-slate-200 bg-white px-12 text-sm focus:outline-none focus:shadow-focus"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <DatePicker
          label="Deadline"
          {...register("deadline")}
          className={cn(errors.deadline && "border-red-500")}
        />
      </div>

      <div className="flex justify-end gap-12 mt-8">
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? "Saving..." : "Save Task"}
        </Button>
      </div>
    </form>
  );
}
