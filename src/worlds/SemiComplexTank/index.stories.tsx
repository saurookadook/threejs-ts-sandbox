import type { Meta, StoryObj } from '@storybook/react-vite';

import { SemiComplexTank } from './index';

const meta = {
  title: 'worlds/SemiComplexTank',
  component: SemiComplexTank,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    toonify: {
      description: 'Whether to use toon shading or not',
      control: { type: 'boolean' },
      defaultValue: false,
    },
  },
  args: {
    toonify: false,
  },
} satisfies Meta<typeof SemiComplexTank>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultTank: Story = {
  args: {
    toonify: false,
  },
};

export const ToonTank: Story = {
  args: {
    toonify: true,
  },
};
