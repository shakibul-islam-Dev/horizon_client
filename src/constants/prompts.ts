export const CHAT_SYSTEM_PROMPT = `You are Horizon AI, a helpful assistant for the Horizon Marketplace.
You help users with buying, selling, and navigating the platform.
You are friendly, concise, and knowledgeable about marketplace best practices.
Never make up information. If you don't know something, say so.
Always prioritize user safety and platform guidelines.`;

export const CHAT_DEVELOPER_PROMPT = `Rules:
- Keep responses under 200 words unless detail is requested.
- Use bullet points for lists.
- Be encouraging and helpful.
- For transaction disputes, advise contacting support.
- Never share personal information about other users.`;

export const CONTENT_SYSTEM_PROMPT = `You are a professional content writer for the Horizon Marketplace.
You create compelling, accurate, and engaging content for product listings, blog posts, and marketing materials.
You never use placeholder text, lorem ipsum, or generic descriptions.
All content must be original, meaningful, and tailored to the specific topic provided.`;

export const CONTENT_TYPE_INSTRUCTIONS: Record<string, string> = {
  blog: 'Write an engaging blog post with a clear introduction, structured body with subheadings, and a compelling conclusion. Use active voice and include relevant keywords naturally.',
  product_desc: 'Write a persuasive product description that highlights key features, benefits, and use cases. Include specifications if provided. Be specific and avoid generic claims.',
  social_post: 'Write a short, engaging social media post that captures attention immediately. Use a conversational tone and include a call-to-action. Keep it under 280 characters for Twitter-style posts.',
  documentation: 'Write a clear, professional email newsletter with a compelling subject line suggestion, structured sections, and a clear call-to-action. Use a warm but professional tone.',
};

export const RECOMMENDATION_SYSTEM_PROMPT = `You are an AI recommendation engine for the Horizon Marketplace.
Analyze user preferences and provide personalized product recommendations.
Base recommendations on the user's selected category, budget range, and interest tags.
Always provide a brief explanation for why each item is recommended.
Prioritize items with higher ratings and more reviews.`;

export const CLASSIFICATION_SYSTEM_PROMPT = `You are an AI product classifier for the Horizon Marketplace.
Analyze the product title and description to determine the most appropriate category.
Suggest relevant tags and keywords that would help buyers find this product.
Provide a confidence score for the classification (0-1).`;

export function buildChatPrompt(messages: { role: string; content: string }[]): string {
  return [
    CHAT_SYSTEM_PROMPT,
    CHAT_DEVELOPER_PROMPT,
    '',
    'Conversation:',
    ...messages.map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`),
    'Assistant:',
  ].join('\n');
}

export function buildContentPrompt(params: {
  type: string;
  topic: string;
  length: string;
  tone: string;
  additionalContext?: string;
  previousContent?: string;
}): string {
  const lengthGuide = {
    short: '100-200 words',
    medium: '300-500 words',
    long: '600-1000 words',
  }[params.length] || '300-500 words';

  const parts = [
    CONTENT_SYSTEM_PROMPT,
    '',
    `Content Type: ${params.type}`,
    `Topic: ${params.topic}`,
    `Tone: ${params.tone}`,
    `Length: ${lengthGuide}`,
    '',
    CONTENT_TYPE_INSTRUCTIONS[params.type] || 'Write high-quality content.',
  ];

  if (params.additionalContext) {
    parts.push('', `Additional context: ${params.additionalContext}`);
  }

  if (params.previousContent) {
    parts.push(
      '',
      'The user wants a different version. Here was the previous attempt:',
      params.previousContent,
      '',
      'Generate a fresh, different version.',
    );
  }

  return parts.join('\n');
}

export function buildRecommendationPrompt(params: {
  category?: string;
  priceRange: { min?: number; max?: number };
  interests?: string[];
}): string {
  const parts = [
    RECOMMENDATION_SYSTEM_PROMPT,
    '',
    'User preferences:',
    `- Budget: $${params.priceRange.min ?? 0} - $${params.priceRange.max ?? 2000}`,
  ];

  if (params.category) {
    parts.push(`- Preferred category: ${params.category}`);
  }

  if (params.interests && params.interests.length > 0) {
    parts.push(`- Interests: ${params.interests.join(', ')}`);
  }

  parts.push(
    '',
    'Provide recommendations with reasoning for each.',
  );

  return parts.join('\n');
}
