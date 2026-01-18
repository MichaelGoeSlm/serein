const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic();

async function analyze(scrapedContent) {
  try {
    const prompt = `Analyze the following web page content and provide a structured analysis:

URL: ${scrapedContent.url}
Title: ${scrapedContent.title}
Meta Description: ${scrapedContent.metaDescription}

Headings:
${scrapedContent.headings.map(h => `${h.level}: ${h.text}`).join('\n')}

Content excerpt:
${scrapedContent.content}

Please provide:
1. A brief summary of what this page is about
2. The main topics covered
3. The target audience
4. Key takeaways
5. Overall quality assessment (content structure, readability)

Format your response in a clear, structured way.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    return message.content[0].text;
  } catch (error) {
    throw new Error(`Analysis failed: ${error.message}`);
  }
}

module.exports = { analyze };
