import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * On-demand cache revalidation
 * 
 * Usage from n8n:
 *   POST https://yoursite.vercel.app/api/revalidate?secret=YOUR_SECRET
 *   Body: { "path": "/movie/inception-27205" }
 *   OR
 *   Body: { "tag": "trending" }
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  const expectedSecret = process.env.CRON_SECRET

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const { path, tag } = body

    if (path) {
      revalidatePath(path)
      return NextResponse.json({
        success: true,
        revalidated: 'path',
        value: path,
        timestamp: new Date().toISOString(),
      })
    }

    if (tag) {
      revalidateTag(tag)
      return NextResponse.json({
        success: true,
        revalidated: 'tag',
        value: tag,
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json(
      { error: 'Provide either "path" or "tag" in body' },
      { status: 400 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: 'Use POST with { path } or { tag } in body',
    docs: 'https://nextjs.org/docs/app/building-your-application/caching#revalidating',
  })
}
