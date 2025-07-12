import { db } from "../../../../db/drizzle";
import { messages } from "../../../../db/schema";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    // Test database connection
    const result = await db.select().from(messages).limit(1);
    
    return Response.json({ 
      success: true, 
      message: "Database connection successful",
      count: result.length 
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
} 