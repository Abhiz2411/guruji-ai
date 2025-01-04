import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function getSolution(text: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful teacher. Provide clear, step-by-step solutions to academic problems.'
        },
        {
          role: 'user',
          content: `Please solve this problem: ${text}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || 'No solution available';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to get solution from AI');
  }
}