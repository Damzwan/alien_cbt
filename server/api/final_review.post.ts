import {GoogleGenerativeAI, SchemaType} from "@google/generative-ai";
import {all_characters, CHARACTERS} from "~/config/characters/characters";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const {
        messages,
        currentOpenness,
        selectedDistortions,
        stacks,
        reviewResults,
        recommendations,
        character
    } = JSON.parse(body);

    const config = useRuntimeConfig(event);
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);

    const characterInfo = all_characters[character as CHARACTERS];

    const formattedTranscript = messages.map((m: any) => {
        const header = m.role === 'user' ? 'THERAPIST' : characterInfo.name.toUpperCase();
        const internal = m.role !== 'user' ? ` [Emotions: ${m.emotion}, Trust: ${m.trust_change}]` : '';
        return `${header}: ${m.text}${internal}`;
    }).join('\n');

    const formattedNotebook = stacks.map((s: any) => {
        const pattern = selectedDistortions.find((d: any) => d.id === s.linkedPatternId);
        return `- Evidence: "${s.fragments.join(' | ')}"\n  Assigned Distortion: ${pattern?.title || 'None'}\n  Therapist's Analysis: ${s.notes}`;
    }).join('\n');

    const model = genAI.getGenerativeModel({
        model: "gemini-3-flash-preview",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: SchemaType.OBJECT,
                properties: {
                    epilogue: {
                        type: SchemaType.OBJECT,
                        properties: {
                            title: {type: SchemaType.STRING},
                            story: {type: SchemaType.STRING}
                        },
                        required: ["title", "story"]
                    },
                    clinical_critique: {
                        type: SchemaType.OBJECT,
                        properties: {
                            strengths: {type: SchemaType.ARRAY, items: {type: SchemaType.STRING}},
                            blind_spots: {type: SchemaType.ARRAY, items: {type: SchemaType.STRING}},
                            mapping_accuracy: {
                                type: SchemaType.INTEGER,
                                description: "0-100 score: Technical precision. Did the therapist correctly identify core distortions and map them to patient lore?"
                            },
                            therapeutic_effectiveness: {
                                type: SchemaType.INTEGER,
                                description: "0-100 score: Patient impact. Did the therapist improve openness and foster healing, or alienate the patient?"
                            },
                            performance_summary: {
                                type: SchemaType.STRING,
                                description: "A professional 3-4 sentence qualitative review of the therapist's bedside manner and clinical impact."
                            }
                        },
                        required: ["strengths", "blind_spots", "mapping_accuracy", "therapeutic_effectiveness", "performance_summary"]
                    }
                },
                required: ["epilogue", "clinical_critique"]
            }
        }
    });

    const prompt = `
You are the Lead Clinical Supervisor. You are observant, slightly cynical, and you've seen too many therapists miss the point. You are evaluating the performance of the therapist.

### PATIENT LORE
${characterInfo.lore}

### TRANSCRIPT
${formattedTranscript}

### PERFORMANCE DATA
- Final Openness: ${currentOpenness}/100
- Notebook Accuracy (Evidence vs. Reality):
${formattedNotebook}
- Therapist Recommendations: "${recommendations}"

### MISSION
1. THE STORY: Write a 3-paragraph epilogue for ${characterInfo.name}.
   - Synthesize the mapping accuracy, the therapeutic effectiveness, and the general "vibe" of the transcript. 
   - Use humor, irony, and specific, distinct references from the transcript to make this feel personal and grounded.
   - If they did a good job, write a story of genuine growth. If they botched it, write a story of stagnation. Be witty—a supervisor with a dry sense of humor who isn't afraid to comment on the absurdity of the situation.

2. CRITIQUE:
   - mapping_accuracy: Score based on how well they analyzed the notebook entries against the lore (Did they get it?).
   - therapeutic_effectiveness: Score based on the final openness and tone of the transcript (Did they actually connect?).
   - performance_summary: Write a direct, sharp, and honest appraisal of their style. Use a professional but conversational tone—like feedback in a private office after a long day. Call out specific brilliant moves or painfully awkward blunders.
`;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
});