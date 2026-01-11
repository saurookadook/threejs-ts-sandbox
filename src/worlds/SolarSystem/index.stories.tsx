import type { Meta, StoryObj } from '@storybook/react-vite';

import { SolarSystem } from './index';

const meta = {
  title: 'worlds/SolarSystem',
  component: SolarSystem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<typeof SolarSystem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
