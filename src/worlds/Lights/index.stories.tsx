import type { Meta, StoryObj } from '@storybook/react-vite';

import { LightType } from '@src/constants';
import { Lights } from './index';

const meta = {
  title: 'worlds/Lights',
  component: Lights,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    lightType: {
      control: 'select',
      options: Object.values(LightType),
    },
    toonify: { control: 'boolean' },
  },
  args: {},
} satisfies Meta<typeof Lights>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AmbientLighting: Story = {
  args: {
    lightType: LightType.AmbientLight,
  },
};

export const DirectionalLighting: Story = {
  args: {
    lightType: LightType.DirectionalLight,
  },
};

export const HemisphereLighting: Story = {
  args: {
    lightType: LightType.HemisphereLight,
  },
};

export const PointLighting: Story = {
  args: {
    lightType: LightType.PointLight,
  },
};

export const RectAreaLighting: Story = {
  args: {
    lightType: LightType.RectAreaLight,
  },
};

export const SpotLighting: Story = {
  args: {
    lightType: LightType.SpotLight,
  },
};
