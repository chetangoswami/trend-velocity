import { getFeedProducts } from "@/modules/feed/services"
import { FeedContainer } from "@/modules/feed/components/FeedContainer"

export const revalidate = 60 // ISR: Revalidate every 60 seconds

export default async function Home() {
  const items = await getFeedProducts()

  return (
    <main className="min-h-screen bg-black">
      <FeedContainer items={items} />
    </main>
  )
}
