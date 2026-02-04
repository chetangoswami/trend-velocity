import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        defineField({
            name: 'medusaId',
            title: 'Medusa Product ID',
            type: 'string',
            description: 'The unique product ID from Medusa (e.g., prod_01ABC123)',
            validation: (Rule) => Rule.required().error('Medusa Product ID is required'),
        }),
        defineField({
            name: 'title',
            title: 'Display Title',
            type: 'string',
            description: 'Product title (for reference, synced from Medusa)',
        }),
        defineField({
            name: 'heroImage',
            title: 'Hero Image',
            type: 'image',
            description: 'Main product image served via Sanity CDN',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'wearTestMedia',
            title: 'Wear Test Media',
            type: 'array',
            description: 'High-res images and videos for the "Wear Test" gallery',
            of: [
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        defineField({
                            name: 'alt',
                            title: 'Alt Text',
                            type: 'string',
                        }),
                        defineField({
                            name: 'caption',
                            title: 'Caption',
                            type: 'string',
                        }),
                    ],
                },
                {
                    type: 'file',
                    title: 'Video',
                    options: { accept: 'video/*' },
                    fields: [
                        defineField({
                            name: 'alt',
                            title: 'Alt Text',
                            type: 'string',
                        }),
                    ],
                },
            ],
        }),
    ],
    preview: {
        select: {
            title: 'title',
            medusaId: 'medusaId',
            media: 'heroImage',
        },
        prepare({ title, medusaId, media }) {
            return {
                title: title || medusaId || 'Untitled Product',
                subtitle: medusaId ? `Medusa: ${medusaId}` : undefined,
                media,
            }
        },
    },
})
