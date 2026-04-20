import { defineField, defineType } from 'sanity'

export const projectSchema = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'id', title: 'ID', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'year', title: 'Year', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      options: { list: ['web', 'game'] },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'role', title: 'Role', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'desc', title: 'Description', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (r) => r.required(),
    }),
    defineField({ name: 'accent', title: 'Accent Color', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'thumb', title: 'Thumbnail CSS Class', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'live', title: 'Live URL', type: 'url' }),
    defineField({ name: 'repo', title: 'Repo URL', type: 'url' }),
    defineField({ name: 'itch', title: 'Itch.io URL', type: 'url' }),
    defineField({ name: 'media', title: 'Media URL', type: 'url' }),
    defineField({
      name: 'body',
      title: 'Body Paragraphs',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'shots',
      title: 'Screenshot URLs',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
})
