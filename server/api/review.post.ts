import {GoogleGenerativeAI, SchemaType} from '@google/generative-ai';
import {all_characters, CHARACTERS} from "~/config/characters/characters";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const {messages, currentOpenness, character} = JSON.parse(body);

    const config = useRuntimeConfig(event);
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);

    // 1. Fetch character-specific data
    const characterInfo = all_characters[character as CHARACTERS];

    // 2. Dynamic event picker based on character's unique event pool
    const pickRandomEvents = (eventPool: any[], n = 3) => {
        const shuffled = [...eventPool].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, n);
    };

    const selectedEvents = pickRandomEvents(characterInfo.events || [], 3);

    // 3. Format the transcript for review
    const formattedSession = messages
        .map((m: any) => `${m.role === 'user' ? 'Therapist' : characterInfo.name}: ${m.text}`)
        .join('\n');

    // @ts-ignore
    const model = genAI.getGenerativeModel({
        model: "gemini-3-flash-preview",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: SchemaType.OBJECT,
                properties: {
                    key_feelings: {
                        type: SchemaType.ARRAY,
                        description: `5-8 emotional takeaways ${characterInfo.name} is carrying after this session.`,
                        items: {type: SchemaType.STRING}
                    },
                    openness: {
                        type: SchemaType.INTEGER,
                        description: `${characterInfo.name}'s new willingness to open up (0-100).`
                    },
                    journal_entry: {
                        type: SchemaType.STRING,
                        description: `A short, vulnerable paragraph in ${characterInfo.name}'s diary voice.`
                    },
                    events: {
                        type: SchemaType.ARRAY,
                        items: {
                            type: SchemaType.OBJECT,
                            properties: {
                                id: {type: SchemaType.STRING},
                                title: {type: SchemaType.STRING},
                                outcome: {
                                    type: SchemaType.STRING,
                                    format: 'enum',
                                    enum: ["success", "partial", "failure"]
                                },
                                narrative: {
                                    type: SchemaType.STRING,
                                    description: `2-4 sentences describing what happened from ${characterInfo.name}'s perspective.`
                                },
                                mood_impact: {
                                    type: SchemaType.INTEGER,
                                    description: "Shift in baseline mood (-20 to +20)"
                                }
                            },
                            required: ["id", "title", "outcome", "narrative", "mood_impact"]
                        }
                    }
                },
                required: ["key_feelings", "openness", "journal_entry", "events"]
            }
        }
    });

    const prompt = `
You are an expert narrative designer processing the aftermath of a therapy session for the character: ${characterInfo.name}.

### CHARACTER LORE
${characterInfo.lore}

### CURRENT STATE
Current openness score: ${currentOpenness}/100

### SESSION TRANSCRIPT
<session>
${formattedSession}
</session>

### TASK
Evaluate the session and determine how it affects ${characterInfo.name}'s life this week.

Three specific events occurred in the days following the session:
${selectedEvents.map((e, i) => `${i + 1}. ID: ${e.id} | "${e.title}": ${e.description}`).join('\n')}

DIRECTIONS:
1. OUTCOMES: Decide if each event was a "success", "partial", or "failure" based strictly on the transcript. Did the therapist provide tools/support, or did ${characterInfo.name} leave feeling judged/unheard?
2. JOURNAL: Write a raw, private diary entry reflecting on the conversation.
3. OPENNESS: Calculate the new openness score (0-100). If the session was breakthrough, increase it (+10 to +20). If it was stagnant or harmful, decrease it.
`;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
});