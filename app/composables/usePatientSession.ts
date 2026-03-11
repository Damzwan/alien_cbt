import {useNotebookStore} from "~/stores/useNotebook";
import {getRandomOpening} from "~/config/sessionOpenings";
import {all_characters, CHARACTERS} from "~/config/characters/characters";
import {useGameStore} from "~/stores/useGame";

export const SESSION_MESSAGES_COUNT = 10
export const SESSION_COUNT = 2

export const usePatientSession = () => {
    const messages = ref<{ role: string, text: string }[]>([]);
    const isStreaming = ref(false);
    const openness = ref(50);
    const currentEmotion = ref('Calm'); // Default state
    const sessionPhase = ref<'active' | 'reviewing' | 'done' | 'final_review' | 'final_reviewing'>('active');
    const reviewResult = ref(null);
    const session = ref(1)
    const sessionMessagesCount = ref(SESSION_MESSAGES_COUNT)
    const finalResult = ref(null)

    const firstMessage = ref("")

    const reviewResults: any[] = []


    const start = () => {
        const {character} = useGameStore()
        const characterInfo = all_characters[character as CHARACTERS]
        firstMessage.value = getRandomOpening(characterInfo.name);
        sessionMessagesCount.value = SESSION_MESSAGES_COUNT
    };


    const startNextSession = () => {
        const {character} = useGameStore()
        const characterInfo = all_characters[character as CHARACTERS]
        const openingText = getRandomOpening(characterInfo.name);
        // @ts-ignore
        messages.value.push({text: openingText, role: "model", firstMessage: true});
        session.value += 1;
        sessionPhase.value = 'active';
        sessionMessagesCount.value = SESSION_MESSAGES_COUNT;
    };

    const runSessionReview = async () => {
        const {character} = useGameStore()

        if (session.value == SESSION_COUNT) {
            sessionPhase.value = 'final_reviewing';

            const {selectedDistortions, stacks, recommendations} = useNotebookStore()


            const response = await fetch('/api/final_review', {
                method: 'POST',
                body: JSON.stringify({
                    messages: messages.value,
                    currentOpenness: openness.value,
                    selectedDistortions,
                    stacks,
                    reviewResults: reviewResults,
                    recommendations,
                    character
                })
            });

            finalResult.value = await response.json();
            sessionPhase.value = 'final_review';
            return
        }


        try {
            sessionPhase.value = 'reviewing';

            const response = await fetch('/api/review', {
                method: 'POST',
                body: JSON.stringify({
                    messages: messages.value,
                    currentOpenness: openness.value,
                    character
                })
            });

            reviewResult.value = await response.json();
            if (!reviewResult.value) return

            const {previousDiary} = storeToRefs(useGameStore())
            previousDiary.value = reviewResult.value
            reviewResults.push(reviewResult.value)
            // @ts-ignore
            openness.value = reviewResult.value.openness;
            sessionPhase.value = 'done';

        } catch (e) {
            console.error('Review failed:', e);
        }
    };
    const sendMessage = async (userInput: string) => {
        // 1. Add user message
        messages.value.push({role: 'user', text: userInput});
        isStreaming.value = true;

        // 2. Prepare AI message
        console.log(messages.value);

        const aiMessage = reactive({role: 'model', text: '', thought: ''});
        messages.value.push(aiMessage);

        // 3. Call the streaming API
        const {character} = useGameStore()

        const response = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({
                messages: messages.value,
                openness: openness.value,
                session: session.value,
                previousSessionResult: reviewResult.value,
                character
            })
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        let buffer = '';

        while (true) {
            const {done, value} = await reader!.read();
            if (done) break;

            // Decode chunk and split by newlines (each newline is a JSON or partial chunk)
            const chunk = decoder.decode(value);
            buffer += chunk;

            const lines = buffer.split('\n');
            // Keep the last line in the buffer if it's incomplete
            buffer = lines.pop()!;

            for (const line of lines) {
                if (!line.trim()) continue;

                try {
                    const parsed = JSON.parse(line);

                    if (parsed.type === 'dialogue') {
                        // Real-time streamed dialogue
                        aiMessage.text += parsed.text;
                    } else if (parsed.type === 'metadata') {
                        // Update thought, trust, emotion
                        console.log(parsed);
                        if (parsed.thought) aiMessage.thought = parsed.thought;
                        if (parsed.trust_change !== undefined) openness.value += parsed.trust_change;
                        if (parsed.emotion) currentEmotion.value = parsed.emotion;
                    }
                } catch (err) {
                    console.error('Failed to parse streamed JSON:', err, line);
                }
            }
        }

        // Process any leftover buffer (in case metadata came in the last chunk)
        if (buffer.trim()) {
            try {
                const parsed = JSON.parse(buffer);
                if (parsed.type === 'metadata') {
                    if (parsed.thought) aiMessage.thought = parsed.thought;
                    if (parsed.trust_change !== undefined) openness.value += parsed.trust_change;
                    if (parsed.emotion) currentEmotion.value = parsed.emotion;
                }
            } catch (err) {
                console.error('Failed to parse leftover buffer JSON:', err, buffer);
            }
        }

        isStreaming.value = false;
        sessionMessagesCount.value -= 1
    };
    return {
        messages,
        isStreaming,
        openness,
        start,
        sendMessage,
        currentEmotion,
        sessionPhase,
        startNextSession,
        reviewResult,
        session,
        sessionMessagesCount,
        runSessionReview,
        finalResult,
        firstMessage
    };
};