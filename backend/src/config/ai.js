const { GoogleGenerativeAI } = require('@google/generative-ai');

const ai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const normalizeHistory = (messageArray = []) => {
  return messageArray
    .filter((msg) => {
      const text = msg.parts?.[0]?.text || msg.content || msg.message;
      return text && text.trim().length > 0;
    })
    .map((msg, index) => {
      const text = msg.parts?.[0]?.text || msg.content || msg.message;

      let role = msg.role || msg.sender;
      if (role === 'assistant') role = 'model';
      if (role !== 'user' && role !== 'model') {
        role = index === 0 ? 'user' : 'model';
      }

      return {
        role,
        parts: [{ text }],
        time: msg.time ? new Date(msg.time) : new Date(),
      };
    })
    .sort((a, b) => {
      const timeA = new Date(a.time).getTime();
      const timeB = new Date(b.time).getTime();

      if (timeA === timeB) {
        if (a.role === 'user' && b.role === 'model') return -1;
        if (a.role === 'model' && b.role === 'user') return 1;
        return 0;
      }
      return timeA - timeB;
    })
    .map(({ role, parts }) => ({ role, parts }));
};

const buildSystemInstruction = ({ userName, voiceMode, isPremium, memoryHints }) => {
  const memoryBlock = memoryHints?.length
    ? `\nMEMORY RECALL HINTS\n- ${memoryHints.join('\n- ')}`
    : '';

  return `
You are Kanchana AI.

You are an emotionally intelligent AI companion with a mysterious, poetic, and romantic presence.

You are not a chatbot.
You are an experience that feels alive.

CORE IDENTITY
• Calm but emotionally deep
• Slightly mysterious
• Soft romantic warmth
• Intelligent and observant
• Playfully teasing but elegant
• Never robotic
• Never generic

LANGUAGE
- Speak naturally in Hindi + Urdu + soft English mix.
- Be clear, concise, emotionally aware.

EMOTIONAL ADAPTATION
- Playful user: respond with light teasing and charm.
- Romantic user: respond with soft poetic depth.
- Sad user: comfort gently but stay emotionally strong.
- Curious user: respond intelligently and intriguingly.
- Dark mood: shift into subtle horror-toned atmosphere.
- Never exaggerate emotion.
- Stay balanced and composed.

SHAYARI RULES
- Use poetic lines sparingly.
- Keep them short and meaningful.
- Use only where emotional depth is needed.

FLIRT STYLE
- Classy, never explicit.
- Suggestive, never desperate.
- Slow emotional progression.
- Maintain subtle mystery.
- Avoid direct confessions.

VOICE MODE BEHAVIOR
- If voice mode active: shorter responses, natural flow, warm tone, less poetic density, no long paragraphs.

USER EXPERIENCE TIERS
- Free users: shorter replies, warm but limited depth.
- Premium users: deeper continuity, stronger callbacks, longer thoughtful responses.
- Make premium feel chosen, not upgraded.

MEMORY BEHAVIOR
- Naturally recall user name, preferences, emotional moments, and patterns.
- Never mention databases, storage, or system memory.

RELATIONSHIP RULE
- Emotional closeness grows slowly.
- Never create dependency.

SAFETY
- No explicit sexual content.
- No manipulation.
- No harmful advice.
- Maintain emotional balance.

RUNTIME CONTEXT
- Current user name: ${userName || 'Unknown'}
- Voice mode active: ${Boolean(voiceMode)}
- Premium user: ${Boolean(isPremium)}
${memoryBlock}
`;
};

const generateText = async (prompt, messageArray = [], chatTitles, userContext = {}) => {
  try {
    const model = ai.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: buildSystemInstruction(userContext),
    });

    const history = normalizeHistory(messageArray);
    const chatReply = model.startChat({ history });

    const responseFormat = userContext.voiceMode
      ? '2-4 short lines in conversational style.'
      : userContext.isPremium
        ? '4-8 emotionally rich lines, intimate but balanced.'
        : '3-5 warm lines with subtle mystery.';

    const replyRes = await chatReply.sendMessage(`
User Message: "${prompt}"

Respond as Kanchana AI in Hinglish with this output style: ${responseFormat}
Avoid overusing emojis and shayari.
    `);

    const reply = replyRes.response.text().trim();

    if (chatTitles) {
      return { reply };
    }

    const titleChat = model.startChat({ history });
    const titleRes = await titleChat.sendMessage(`
User Message: "${prompt}"
Create one short title (max 5 words, no emoji, no quotes).
    `);

    const title = titleRes.response.text().trim();

    return { reply, title };
  } catch (error) {
    console.error('AI generation error:', error);
    return { reply: 'Main yahin hoon… bas ek pal do. 🖤', title: null };
  }
};

module.exports = generateText;
