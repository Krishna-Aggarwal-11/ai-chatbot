import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { config } from "dotenv";
import { auth } from "@/lib/auth";
import { db } from "../../../../db/drizzle";
import { messages } from "../../../../db/schema";
import { eq, and, desc } from "drizzle-orm";

config({
    path: ".env.local",
});

const gemini = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
})

const HTML_CSS_SYSTEM_PROMPT = `You are an expert frontend developer specializing in creating clean, semantic, and well-structured HTML and CSS code.

GUIDELINES:
1. Always use semantic HTML5 elements (header, nav, main, section, article, aside, footer)
2. Follow BEM methodology for CSS class naming
3. Write mobile-first responsive CSS
4. Use CSS Grid and Flexbox for layouts
5. Include proper accessibility attributes (alt, aria-labels, etc.)
6. Use meaningful class names and IDs
7. Structure code with proper indentation
8. Add comments for complex sections
9. Follow modern CSS best practices
10. Ensure cross-browser compatibility

OUTPUT FORMAT:
Provide your response in this exact format:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Title</title>
    <style>
        /* ALL YOUR CSS STYLES GO HERE */
        /* Include all CSS including reset, variables, utility classes, component styles, and media queries */
    </style>
</head>
<body>
    <!-- ALL YOUR HTML STRUCTURE GOES HERE -->
    <!-- Include complete HTML with all sections, navigation, content, and footer -->
</body>
</html>
\`\`\`

Then provide a brief explanation of the key features and structure of the code you generated. The explanation should focus on the overall design approach, layout structure, and key features, NOT the CSS details.

IMPORTANT: Always wrap your HTML code in \`\`\`html code blocks exactly as shown above.
`;

export async function POST(req: Request) {

    const session = await auth();
    
    if (!session?.user?.id) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const { messages: chatMessages } = await req.json();

    if (!chatMessages || !Array.isArray(chatMessages) || chatMessages.length === 0) {
        return new Response(JSON.stringify({ error: 'Messages are required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    
    const lastMessage = chatMessages[chatMessages.length - 1];
    if (lastMessage.role !== 'user') {
        return new Response(JSON.stringify({ error: 'Last message must be from user' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }


    
    const recentMessages = await db.select()
        .from(messages)
        .where(
            and(
                eq(messages.userId, parseInt(session.user.id)),
                eq(messages.prompt, lastMessage.content)
            )
        )
        .orderBy(desc(messages.createdAt))
        .limit(1);

    if (recentMessages.length > 0) {
        const recentMessage = recentMessages[0];
        const timeDiff = Date.now() - recentMessage.createdAt.getTime();
        if (timeDiff < 5000) { 
         
            const result = await streamText({
                model: gemini("gemini-2.0-flash-001"),
                prompt: lastMessage.content,
                system: HTML_CSS_SYSTEM_PROMPT
            });
            return result.toDataStreamResponse();
        }
    }

    const result = await streamText({
        model: gemini("gemini-2.0-flash-001"),
        prompt: lastMessage.content,
        system: HTML_CSS_SYSTEM_PROMPT
    });

    
    const userMessageId = await db.insert(messages).values({
        userId: parseInt(session.user.id),
        prompt: lastMessage.content,
        response: '', 
    }).returning({ id: messages.id });

    
    let fullResponse = '';
    const transformStream = new TransformStream({
        transform(chunk, controller) {
            const text = new TextDecoder().decode(chunk);
            fullResponse += text;
            controller.enqueue(chunk);
        },
        flush(controller) {
           
            db.update(messages)
                .set({ response: fullResponse })
                .where(eq(messages.id, userMessageId[0].id))
                .catch(console.error);
            controller.terminate();
        }
    });

    const response = result.toDataStreamResponse();
    const responseBody = response.body;
    
    if (responseBody) {
        const transformedBody = responseBody.pipeThrough(transformStream);
        return new Response(transformedBody, {
            headers: response.headers,
            status: response.status,
        });
    }

    return response;
}
