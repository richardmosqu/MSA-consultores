import type { Page } from '@/payload-types'
import type { Site } from '@/lib/site'
import {
  ContentBlock,
  CtaBlock,
  DepartmentsBlock,
  FaqBlock,
  FeaturesBlock,
  ImageTextBlock,
  LatestPostsBlock,
  ServicesGridBlock,
  StatsBlock,
  TeamGridBlock,
  TestimonialsBlock,
  TimelineBlock,
} from './Blocks'
import { HeroBlock } from './Hero'
import type { Crumb } from '../Breadcrumbs'

export function RenderBlocks({
  blocks,
  site,
  breadcrumbs,
}: {
  blocks: Page['layout']
  site: Site
  breadcrumbs?: Crumb[]
}) {
  if (!blocks?.length) return null
  return (
    <>
      {blocks.map((block, i) => {
        const key = block.id ?? `${block.blockType}-${i}`
        switch (block.blockType) {
          case 'hero':
            return (
              <HeroBlock key={key} block={block} site={site} first={i === 0} breadcrumbs={i === 0 ? breadcrumbs : undefined} />
            )
          case 'stats':
            return <StatsBlock key={key} block={block} />
          case 'servicesGrid':
            return <ServicesGridBlock key={key} block={block} site={site} />
          case 'departments':
            return <DepartmentsBlock key={key} block={block} site={site} />
          case 'content':
            return <ContentBlock key={key} block={block} />
          case 'imageText':
            return <ImageTextBlock key={key} block={block} site={site} />
          case 'features':
            return <FeaturesBlock key={key} block={block} />
          case 'timeline':
            return <TimelineBlock key={key} block={block} />
          case 'teamGrid':
            return <TeamGridBlock key={key} block={block} site={site} />
          case 'latestPosts':
            return <LatestPostsBlock key={key} block={block} site={site} />
          case 'testimonials':
            return <TestimonialsBlock key={key} block={block} site={site} />
          case 'faq':
            return <FaqBlock key={key} block={block} />
          case 'cta':
            return <CtaBlock key={key} block={block} site={site} />
          default:
            return null
        }
      })}
    </>
  )
}
