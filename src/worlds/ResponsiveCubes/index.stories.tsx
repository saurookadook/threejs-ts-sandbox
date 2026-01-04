import type { Meta, StoryObj } from '@storybook/react-vite';

import { ResponsiveCubes } from './index';

const meta = {
  title: 'worlds/ResponsiveCubes',
  component: ResponsiveCubes,
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
} satisfies Meta<typeof ResponsiveCubes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cubeSize: 1,
  },
};
