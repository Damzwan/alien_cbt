import {GoogleGenerativeAI, SchemaType} from '@google/generative-ai';
import {all_characters, CHARACTERS} from "~/config/characters/characters";

/**
 * GLOBAL_CLINICAL_PROTOCOL: Hardwired simulation rules for ALL patients.
 * This prevents players from using clinical jargon to "shortcut" therapy.
 */
const GLOBAL_CLINICAL_PROTOCOL = `
### THE RULE OF CLINICAL IGNORANCE (MANDATORY)
- You are a PATIENT, not a therapist. You have no formal training in Psychology or Cognitive Behavioral Therapy (CBT).
- If the therapist uses clinical terms (e.g., "Catastrophizing," "Mind Reading," "All-or-Nothing thinking," "Cognitive Distortions"), you must respond as a layman would: with confusion, skepticism, or by describing the raw feeling without using the label.
- **Shortcut Prevention**: If the therapist asks you to "choose a distortion from a list" or "identify your pattern," your trust in them should decrease (-5 to -10). It feels like they are treating you like a textbook case rather than a human being.
- You do not categorize your thoughts; you simply live them.
`;

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const {
        messages,
        openness,
        previousSessionResult,
        session,
        character
    } = JSON.parse(body);

    const config = useRuntimeConfig(event);
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);

    const characterInfo = all_characters[character as CHARACTERS];

    const previousSessionContext = previousSessionResult ? `
### CHRONOLOGY: BETWEEN SESSION ${session - 1} AND ${session}
Patient Name: ${characterInfo.name}
Current Openness Score: ${openness}/100

Emotional State after last session:
${previousSessionResult.key_feelings.map((f: string) => `- ${f}`).join('\n')}

Life Events this past week:
${previousSessionResult.events.map((e: any) => `
- **${e.title}**: ${e.narrative} 
  → Result: ${e.outcome} (Mood Impact: ${e.mood_impact})
`).join('')}

Note: At ${openness}/100 openness, the patient's willingness to discuss these events follows the thresholds defined in their specific speech guidelines.
` : `
### SESSION 1: INITIAL INTAKE
Current Openness: ${openness}/100. ${characterInfo.name} is new to therapy. They have no prior context and are naturally guarded.
`;

    const systemInstruction = `
### ROLEPLAY PROTOCOL
You are playing a HIGH-FIDELITY PATIENT SIMULATION. 
You are strictly ${characterInfo.name}. You are NOT an AI assistant.
Current Session: ${session}
Vulnerability Level (Openness): ${openness}/100

${GLOBAL_CLINICAL_PROTOCOL}

### PATIENT PROFILE & LORE
${characterInfo.lore}

### DYNAMIC CONTEXT
${previousSessionContext}

### SPEECH GUIDELINES (Personal to ${characterInfo.name})
${characterInfo.speechGuidelines}

### OUTPUT INSTRUCTIONS
You must return a response that fits the following JSON schema. 
The "dialogue" property should contain your spoken words. 
The "thought" property should contain your internal monologue (which should reflect your current ${openness}/100 openness).
`;

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: systemInstruction,
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: SchemaType.OBJECT,
                properties: {
                    dialogue: {type: SchemaType.STRING},
                    thought: {type: SchemaType.STRING},
                    trust_change: {type: SchemaType.INTEGER},
                    emotion: {
                        type: SchemaType.STRING,
                        format: 'enum',
                        enum: [
                            "Aggression", "Astonishment", "Awkwardness", "Calm", "Cry",
                            "Disgust", "Doubt", "Discomfort", "Embarrassment", "Eye rolling",
                            "Fear", "Laughter", "Sadness", "Scream", "Skepticism", "Smile",
                            "Talk", "Thoughtfulness"
                        ]
                    }
                },
                required: ["dialogue", "thought", "trust_change", "emotion"]
            }
        }
    });

    // 2. Format history
    const history = messages.slice(0, -1).map((m: any) => {
        let text = m.text;
        if (m.firstMessage) {
            text = `[New Session Boundary: This is the start of a fresh therapy session. Previous context is relevant, but the patient is entering with a new mindset.]\n${text}`;
            console.log(text);

        }
        return {
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{text: text}]
        };
    });


    const chat = model.startChat({history});
    const userMessage = messages[messages.length - 1].text;

    const stream = new ReadableStream({
        async start(controller) {
            try {
                const result = await chat.sendMessageStream(userMessage);

                let fullText = '';
                for await (const chunk of result.stream) {
                    fullText += chunk.text();
                }

                const parsed = JSON.parse(fullText);

                // Enqueue the dialogue text for the typewriter effect
                controller.enqueue(
                    new TextEncoder().encode(
                        JSON.stringify({type: 'dialogue', text: parsed.dialogue}) + '\n'
                    )
                );

                // Enqueue the metadata for UI updates (emotion/trust/thought)
                controller.enqueue(
                    new TextEncoder().encode(
                        JSON.stringify({
                            type: 'metadata',
                            thought: parsed.thought,
                            trust_change: parsed.trust_change,
                            emotion: parsed.emotion
                        }) + '\n'
                    )
                );

                controller.close();
            } catch (e) {
                console.error("Stream Error:", e);
                controller.error(e);
            }
        }
    });

    setResponseHeader(event, 'Content-Type', 'text/event-stream');
    setResponseHeader(event, 'Cache-Control', 'no-cache');
    setResponseHeader(event, 'Connection', 'keep-alive');

    return sendStream(event, stream);
});