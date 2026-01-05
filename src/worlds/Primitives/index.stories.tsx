import type { Meta, StoryObj } from '@storybook/react-vite';

import { Primitives } from './index';

const meta = {
  title: 'worlds/Primitives',
  component: Primitives,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    cubeSize: { control: 'number' },
  },
  args: {
    cubeSize: 1,
  },
} satisfies Meta<typeof Primitives>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cubeSize: 1,
  },
};
