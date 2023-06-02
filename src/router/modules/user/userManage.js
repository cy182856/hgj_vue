/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const user = {
  path: '/table/user',
  component: Layout,
  redirect: '/user-list',
  name: 'Table',
  meta: {
    title: '用户管理',
    icon: 'table'
  },
  children: [
    {
      path: 'inline-edit-table',
      component: () => import('@/views/table/inline-edit-table'),
      name: 'InlineEditTable',
      meta: { title: 'Inline Edit' }
    },
    {
      path: 'user-list',
      component: () => import('@/views/table/user/user-list'),
      name: 'ComplexTable',
      meta: { title: '用户列表' }
    }
  ]
}
export default user
