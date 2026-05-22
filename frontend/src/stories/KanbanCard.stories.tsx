import type { Meta, StoryObj } from "@storybook/react";
import { KanbanCard } from "../components/kanban/KanbanCard";
const meta: Meta<typeof KanbanCard> = { component: KanbanCard };
export default meta;
export const Default: StoryObj<typeof KanbanCard> = { args: { task: { id: "1", title: "Test Task", priority: "high", status: "TODO" } } };
