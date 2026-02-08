import { TreeNode } from './types';
import { v4 as uuidv4 } from 'uuid';

// Simulated lazy-loaded children data
const lazyChildrenMap: Record<string, TreeNode[]> = {};

export const initialTreeData: TreeNode[] = [
  {
    id: uuidv4(),
    name: 'Level A',
    isExpanded: true,
    children: [
      {
        id: uuidv4(),
        name: 'Level A',
        isExpanded: true,
        children: [
          {
            id: uuidv4(),
            name: 'Level A',
            isExpanded: true,
            children: [
              {
                id: uuidv4(),
                name: 'Level A',
                hasChildren: true,
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: uuidv4(),
        name: 'Level A',
        hasChildren: true,
        children: [],
      },
      {
        id: uuidv4(),
        name: 'Level A',
        hasChildren: false,
        children: [],
      },
    ],
  },
  {
    id: uuidv4(),
    name: 'Level A',
    hasChildren: true,
    children: [],
  },
];

// Simulate async API call for lazy loading
export const fetchChildren = (nodeId: string): Promise<TreeNode[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate random children for lazy loading simulation
      if (lazyChildrenMap[nodeId]) {
        resolve(lazyChildrenMap[nodeId]);
      } else {
        const children: TreeNode[] = [
          {
            id: uuidv4(),
            name: 'Lazy Child 1',
            hasChildren: true,
            children: [],
          },
          {
            id: uuidv4(),
            name: 'Lazy Child 2',
            hasChildren: false,
            children: [],
          },
        ];
        lazyChildrenMap[nodeId] = children;
        resolve(children);
      }
    }, 800); // Simulate network delay
  });
};
