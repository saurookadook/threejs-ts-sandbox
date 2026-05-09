import type { Meta, StoryObj } from '@storybook/react-vite';

import { FlowerCube } from './index';

const meta = {
  title: 'worlds/FlowerCube',
  component: FlowerCube,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    cubeSize: { control: 'number' },
  },
  args: {
    cubeSize: 1,
  },
} satisfies Meta<typeof FlowerCube>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cubeSize: 1,
  },
};
