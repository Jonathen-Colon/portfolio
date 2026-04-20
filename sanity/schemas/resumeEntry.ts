import { defineField, defineType } from 'sanity'

export const resumeRowSchema = defineType({
  name: 'resumeRow',
  title: 'Resume Row',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'org', title: 'Organization', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'year', title: 'Year', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'tag', title: 'Tag', type: 'string' }),
  ],
})

export const resumeSchema = defineType({
  name: 'resume',
  title: 'Resume',
  type: 'document',
  fields: [
    defineField({
      name: 'work',
      title: 'Work Experience',
      type: 'array',
      of: [{ type: 'resumeRow' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'speaking',
      title: 'Speaking',
      type: 'array',
      of: [{ type: 'resumeRow' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'education',
      title: 'Education',
      type: 'array',
      of: [{ type: 'resumeRow' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (r) => r.required(),
    }),
  ],
})
