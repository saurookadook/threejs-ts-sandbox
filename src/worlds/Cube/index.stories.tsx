import type { Meta, StoryObj } from '@storybook/react-vite';

import { Cube } from './index';

const meta = {
  title: 'worlds/Cube',
  component: Cube,
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
} satisfies Meta<typeof Cube>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cubeSize: 1,
  },
};
