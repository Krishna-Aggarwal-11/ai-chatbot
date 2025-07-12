import { auth } from "@/lib/auth";
import { db } from "../../../../db/drizzle";
import { messages } from "../../../../db/schema";
import { eq, like, desc, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const userId = parseInt(session.user.id);
    

    const whereConditions = search.trim() 
      ? and(eq(messages.userId, userId), like(messages.prompt, `%${search}%`))
      : eq(messages.userId, userId);

    const userMessages = await db
      .select()
      .from(messages)
      .where(whereConditions)
      .orderBy(desc(messages.createdAt))
      .limit(limit)
      .offset(offset);

    
    const totalCountResult = await db
      .select({ count: messages.id })
      .from(messages)
      .where(whereConditions);

    const totalCount = totalCountResult.length;

    return Response.json({ 
      success: true, 
      messages: userMessages,
      pagination: {
        page,
        limit,
        total: totalCount,
        hasMore: offset + limit < totalCount
      }
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('id');

    if (!messageId) {
      return Response.json({ error: 'Message ID is required' }, { status: 400 });
    }

  
    await db
      .delete(messages)
      .where(and(
        eq(messages.id, parseInt(messageId)),
        eq(messages.userId, parseInt(session.user.id))
      ));

    return Response.json({ 
      success: true, 
      message: 'Message deleted successfully' 
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
} 