import type { Meta, StoryObj } from '@storybook/react-vite';

import { LionWallCube } from './index';

const meta = {
  title: 'worlds/LionWallCube',
  component: LionWallCube,
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
} satisfies Meta<typeof LionWallCube>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cubeSize: 1,
  },
};
