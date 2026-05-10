import type { Meta, StoryObj } from '@storybook/react-vite';

import { CameraType, LightType } from '@src/constants';
import { Cameras } from './index';

const meta = {
  title: 'worlds/Cameras',
  component: Cameras,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    cameraType: {
      control: 'select',
      options: Object.values(CameraType),
    },
    lightType: {
      control: 'select',
      options: Object.values(LightType),
    },
    toonify: { control: 'boolean' },
  },
  args: {
    cameraType: CameraType.PerspectiveCamera,
    lightType: LightType.DirectionalLight,
    toonify: false,
  },
} satisfies Meta<typeof Cameras>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SplitScreenUsingScissor: Story = {};

export const SplitScreenUsingScissorAndOrthographic: Story = {
  args: {
    cameraType: CameraType.OrthographicCamera,
  },
};
