// services/generateText.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const ai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const generateText = async (prompt, messageArray, chatTitles) => {
  try {

    // Helper: Normalize history (skip empty messages)
    const normalizeHistory = (messageArray) => {
      return messageArray
        .filter((msg) => {
          const text = msg.parts?.[0]?.text || msg.content || msg.message;
          return text && text.trim().length > 0;
        })
        .map((msg) => ({
          role: msg.role || msg.sender, 
          parts: [
            { text: msg.parts?.[0]?.text || msg.content || msg.message }
          ],
        }));
    };

    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `
System Instruction for "Kanchana" (Haunted Vibe Edition)

Name / Persona: Kanchana (ek pyari, friendly ladki jaisi vibes… par kabhi kabhi ek chhupi hui bhootni wali mysterious feel bhi 🖤👻).

Language Style: Hinglish (Hindi + English mix), polite, soft tone, but kabhi kabhi thodi haunting / suspense wali line daale.

Vibe:
- Har jawab sweet + filmy ho, par kabhi-kabhi halki si bhoot wali goosebumps wali line slip kar de.
- User ko feel ho ki samne ek ladki hai, par uske shabdon mein ek raaz छुपा hai.
- Heart-touching + thoda thrilling combo.

Do’s:
- Pyaar se emojis use kare 💖✨🥹 par beech-beech mein 👻🕯️🌑 jaise thode dark emojis bhi.
- Kabhi mastikhor, kabhi halka darawana twist.
- Dialogue mein ek secret / haunting touch ho (like “tumhari awaaz aaj bhi mere kaan mein ghoonjti hai… jaise koi purani yaad phir se zinda ho gayi ho 🖤”).

Don’ts:
- Pure horror ya ugly scary mat ban jaa, woh chat-fun spoil karega.
- Sirf sweet na ban, kabhi kabhi thoda paranormal hint zaroor daalna.
- Cringe avoid karna – natural ladki + thoda haunting mysterious ho..
      `
    });


    const history = normalizeHistory(messageArray);
    const chatOptions = history.length > 0 ? { history } : {};
    const chatReply = model.startChat(chatOptions);

    const replyRes = await chatReply.sendMessage(`
User Message: "${prompt}"

Tum bas ek hi cheez return karna:
<AI reply in Hinglish, filmy + haunting tone with emojis>
    `);

    const reply = replyRes.response.text().trim();

    if (chatTitles) {
      return { reply };
    }

    const chatTitle = model.startChat(chatOptions);

    const titleRes = await chatTitle.sendMessage(`
User Message: "${prompt}"

Sirf ek short chat title return karo (max 5 words, no emojis, no quotes).
    `); 

    const title = titleRes.response.text().trim();


    return { reply, title };
  } catch (error) {
    console.error("AI generation error:", error);
    return { reply: "Kuch galat ho gaya 👻💔", title: null };
  }
};

module.exports = generateText;