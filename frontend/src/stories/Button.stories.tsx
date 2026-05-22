import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/ui/Button";
const meta: Meta<typeof Button> = { component: Button, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof Button>;
export const Primary: Story = { args: { children: "Primary Button", variant: "primary" } };
export const Outline: Story = { args: { children: "Outline Button", variant: "outline" } };
export const Danger: Story = { args: { children: "Danger Button", variant: "danger" } };
