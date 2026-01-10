import type { Meta, StoryObj } from '@storybook/react-vite';

import { SubdividedSpheres } from './index';

const meta = {
  title: 'worlds/SubdividedSpheres',
  component: SubdividedSpheres,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    radius: { control: 'number' },
    firstSphereWidthSegments: { control: 'number' },
    firstSphereHeightSegments: { control: 'number' },
    secondSphereWidthSegments: { control: 'number' },
    secondSphereHeightSegments: { control: 'number' },
    thirdSphereWidthSegments: { control: 'number' },
    thirdSphereHeightSegments: { control: 'number' },
  },
  args: {
    radius: 7,
    firstSphereWidthSegments: 5,
    firstSphereHeightSegments: 3,
    secondSphereWidthSegments: 24,
    secondSphereHeightSegments: 10,
    thirdSphereWidthSegments: 50,
    thirdSphereHeightSegments: 50,
  },
} satisfies Meta<typeof SubdividedSpheres>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    radius: 7,
    firstSphereWidthSegments: 5,
    firstSphereHeightSegments: 3,
    secondSphereWidthSegments: 24,
    secondSphereHeightSegments: 10,
    thirdSphereWidthSegments: 50,
    thirdSphereHeightSegments: 50,
  },
};
