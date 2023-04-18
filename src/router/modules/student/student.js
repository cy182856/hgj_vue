/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const student = {
  path: '/table/student',
  component: Layout,
  redirect: '/student-list',
  name: 'Table',
  meta: {
    title: '学生管理',
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
      path: 'student-list',
      component: () => import('@/views/table/student/student-list'),
      name: 'ComplexTable',
      meta: { title: '学生列表' }
    }
  ]
}
export default student
