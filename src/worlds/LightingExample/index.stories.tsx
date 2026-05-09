import type { Meta, StoryObj } from '@storybook/react-vite';

import { LightingType } from '@src/constants';
import { LightingExample } from './index';

const meta = {
  title: 'worlds/LightingExample',
  component: LightingExample,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    lightType: {
      control: 'select',
      options: Object.values(LightingType),
    },
    toonify: { control: 'boolean' },
  },
  args: {},
} satisfies Meta<typeof LightingExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AmbientLighting: Story = {
  args: {
    lightType: LightingType.AmbientLight,
  },
};

export const DirectionalLighting: Story = {
  args: {
    lightType: LightingType.DirectionalLight,
  },
};

export const HemisphereLighting: Story = {
  args: {
    lightType: LightingType.HemisphereLight,
  },
};

export const PointLighting: Story = {
  args: {
    lightType: LightingType.PointLight,
  },
};

export const RectAreaLighting: Story = {
  args: {
    lightType: LightingType.RectAreaLight,
  },
};

export const SpotLighting: Story = {
  args: {
    lightType: LightingType.SpotLight,
  },
};
