import { defineField, defineType } from 'sanity'

export const nowItemSchema = defineType({
  name: 'nowItem',
  title: 'Now Item',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', title: 'Body', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'progress', title: 'Progress', type: 'number' }),
    defineField({ name: 'color', title: 'Color CSS Class', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'icon', title: 'Icon', type: 'string', validation: (r) => r.required() }),
  ],
})
