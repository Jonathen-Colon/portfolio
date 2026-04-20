import { defineField, defineType } from 'sanity'

export const postSchema = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({ name: 'id', title: 'ID', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'date', title: 'Date', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'read', title: 'Read Time', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'tag', title: 'Tag', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'thumb', title: 'Thumbnail CSS Class', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'body',
      title: 'Body Paragraphs',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (r) => r.required(),
    }),
  ],
})
